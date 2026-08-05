import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { getAuthenticatedUserId, setOptionalAuthenticatedUser } from '../utils/auth.js';
import { HttpError, getErrorMessage, getErrorStatusCode, isRecordNotFoundError } from '../utils/httpError.js';
import type { ArticleIdParams, IdParams } from '../types/api.js';

export async function getArticles(req: Request, res: Response) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const offset = (page - 1) * limit;
    const keyword = String(req.query.keyword || '').trim();
    const orderBy: Prisma.ArticleOrderByWithRelationInput =
      req.query.orderBy === 'like' ? { likeCount: 'desc' } : { createdAt: 'desc' };
    if (keyword.length > 50) return res.status(400).json({ message: '검색어는 50자 이내로 입력해 주세요.' });

    const where: Prisma.ArticleWhereInput = keyword
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
    res.status(500).json({ message: getErrorMessage(error) });
  }
}

export async function createArticle(req: Request, res: Response) {
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
    res.status(400).json({ message: getErrorMessage(error) });
  }
}

export async function getArticle(req: Request<IdParams>, res: Response) {
  try {
    setOptionalAuthenticatedUser(req);
    // 비로그인(-1)은 어떤 실제 userId와도 매칭되지 않는 좋아요 조회 sentinel
    const userId = req.user?.id ?? -1;
    const article = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        likeCount: true,
        createdAt: true,
        likes: { where: { userId }, select: { id: true } },
      },
    });
    if (!article) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    const { likes, ...articleWithoutLikes } = article;
    res.json({ ...articleWithoutLikes, isLiked: likes.length > 0 });
  } catch {
    res.status(400).json({ message: '잘못된 게시글 id입니다.' });
  }
}

export async function updateArticle(req: Request<IdParams>, res: Response) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const current = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
      select: { userId: true },
    });
    if (!current) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    if (current.userId !== userId) return res.status(403).json({ message: '권한이 없습니다.' });

    const data: Prisma.ArticleUpdateInput = {};
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.content !== undefined) data.content = req.body.content;
    if (req.body.image !== undefined) data.image = req.body.image;

    const article = await prisma.article.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(article);
  } catch (error) {
    if (isRecordNotFoundError(error)) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.status(400).json({ message: getErrorMessage(error) });
  }
}

export async function deleteArticle(req: Request<IdParams>, res: Response) {
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
    if (isRecordNotFoundError(error)) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    res.status(500).json({ message: getErrorMessage(error) });
  }
}

export async function likeArticle(req: Request<ArticleIdParams>, res: Response) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const articleId = Number(req.params.articleId);
    const article = await prisma.$transaction(async (tx) => {
      const exists = await tx.article.findUnique({ where: { id: articleId }, select: { id: true } });
      if (!exists) throw new HttpError('게시글을 찾을 수 없습니다.', 404);

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
    res.status(getErrorStatusCode(error, 400)).json({ message: getErrorMessage(error) });
  }
}

export async function unlikeArticle(req: Request<ArticleIdParams>, res: Response) {
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
    res.status(400).json({ message: getErrorMessage(error) });
  }
}
