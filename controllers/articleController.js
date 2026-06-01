import prisma from '../lib/prisma.js';

export async function getArticles(req, res) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const offset = (page - 1) * limit;
    const keyword = String(req.query.keyword || '').trim();
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
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: { id: true, title: true, content: true, createdAt: true },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({ list: articles, totalCount: total, offset, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createArticle(req, res) {
  try {
    const article = await prisma.article.create({
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getArticle(req, res) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    if (!article) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.json(article);
  } catch {
    res.status(400).json({ message: '잘못된 게시글 id입니다.' });
  }
}

export async function updateArticle(req, res) {
  try {
    const data = {};
    ['title', 'content'].forEach((key) => {
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
  try {
    await prisma.article.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.status(500).json({ message: error.message });
  }
}
