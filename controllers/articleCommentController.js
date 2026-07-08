import prisma from '../lib/prisma.js';
import { getAuthenticatedUserId } from '../utils/auth.js';

export async function createArticleComment(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const articleId = Number(req.params.articleId);
    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    const comment = await prisma.articleComment.create({
      data: { content: req.body.content, articleId, userId },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getArticleComments(req, res) {
  try {
    const articleId = Number(req.params.articleId);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const cursor = req.query.cursor ? { cursor: { id: Number(req.query.cursor) }, skip: 1 } : {};

    const comments = await prisma.articleComment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'asc' },
      take: limit + 1,
      select: { id: true, content: true, createdAt: true },
      ...cursor,
    });

    const hasNext = comments.length > limit;
    if (hasNext) comments.pop();

    res.json({ list: comments, nextCursor: hasNext ? comments[comments.length - 1].id : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateArticleComment(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const currentComment = await prisma.articleComment.findUnique({
      where: { id: Number(req.params.commentId) },
      select: { articleId: true, userId: true },
    });

    if (!currentComment) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    if (currentComment.articleId !== Number(req.params.articleId)) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    if (currentComment.userId !== userId) return res.status(403).json({ message: '권한이 없습니다.' });

    const comment = await prisma.articleComment.update({
      where: { id: Number(req.params.commentId) },
      data: { content: req.body.content },
    });
    res.json(comment);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    res.status(400).json({ message: error.message });
  }
}

export async function deleteArticleComment(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const comment = await prisma.articleComment.findUnique({
      where: { id: Number(req.params.commentId) },
      select: { articleId: true, userId: true },
    });

    if (!comment) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    if (comment.articleId !== Number(req.params.articleId)) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    if (comment.userId !== userId) return res.status(403).json({ message: '권한이 없습니다.' });

    await prisma.articleComment.delete({ where: { id: Number(req.params.commentId) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    res.status(500).json({ message: error.message });
  }
}
