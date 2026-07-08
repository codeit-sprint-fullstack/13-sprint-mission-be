import prisma from '../lib/prisma.js';
import { getAuthenticatedUserId, setOptionalAuthenticatedUser } from '../utils/auth.js';

export async function getArticles(req, res) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const offset = (page - 1) * limit;
    const keyword = String(req.query.keyword || '').trim();
    const orderBy = req.query.orderBy === 'like' ? { likeCount: 'desc' } : { createdAt: 'desc' };
    if (keyword.length > 50) return res.status(400).json({ message: '검색어는 50자 이내로 입력해 주세요.' });

    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { content: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {};

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        select: { id: true, title: true, content: true, image: true, likeCount: true, createdAt: true },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({ list: articles, totalCount: total, offset, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createArticle(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const article = await prisma.article.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image || null,
        userId,
      },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getArticle(req, res) {
  try {
    setOptionalAuthenticatedUser(req);
    const userId = req.user?.id;
    const article = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        likeCount: true,
        createdAt: true,
        likes: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });
    if (!article) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.json({
      ...article,
      isLiked: Boolean(article.likes?.length),
      likes: undefined,
    });
  } catch {
    res.status(400).json({ message: '잘못된 게시글 id입니다.' });
  }
}

export async function updateArticle(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const current = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
      select: { userId: true },
    });
    if (!current) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    if (current.userId !== userId) return res.status(403).json({ message: '권한이 없습니다.' });

    const data = {};
    ['title', 'content', 'image'].forEach((key) => {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    });
    const article = await prisma.article.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(article);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.status(400).json({ message: error.message });
  }
}

export async function deleteArticle(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const current = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
      select: { userId: true },
    });
    if (!current) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    if (current.userId !== userId) return res.status(403).json({ message: '권한이 없습니다.' });

    await prisma.article.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.status(500).json({ message: error.message });
  }
}

export async function likeArticle(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const articleId = Number(req.params.articleId);
    const article = await prisma.$transaction(async (tx) => {
      const exists = await tx.article.findUnique({ where: { id: articleId }, select: { id: true } });
      if (!exists) {
        const error = new Error('게시글을 찾을 수 없습니다.');
        error.statusCode = 404;
        throw error;
      }

      const like = await tx.articleLike.findUnique({
        where: { userId_articleId: { userId, articleId } },
      });
      if (like) return tx.article.findUnique({ where: { id: articleId } });

      await tx.articleLike.create({ data: { userId, articleId } });
      return tx.article.update({
        where: { id: articleId },
        data: { likeCount: { increment: 1 } },
      });
    });

    res.json({ ...article, isLiked: true });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
}

export async function unlikeArticle(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const articleId = Number(req.params.articleId);
    const article = await prisma.$transaction(async (tx) => {
      const like = await tx.articleLike.findUnique({
        where: { userId_articleId: { userId, articleId } },
      });
      if (!like) return tx.article.findUnique({ where: { id: articleId } });

      await tx.articleLike.delete({ where: { id: like.id } });
      return tx.article.update({
        where: { id: articleId },
        data: { likeCount: { decrement: 1 } },
      });
    });

    if (!article) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.json({ ...article, isLiked: false });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
