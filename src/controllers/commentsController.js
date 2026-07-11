import prisma from "../utils/prisma.js";
import {
  commentIdParamSchema,
  commentBodySchema,
  commentListQuerySchema,
} from "../validators/commentValidators.js";
import { idParamSchema } from "../validators/commonValidators.js";

// ── 상품 댓글 ──────────────────────────────────────────────

export async function listProductComments(req, res) {
  const { id: productId } = idParamSchema.parse({ id: req.params.productId });
  const { cursor, limit = 10 } = commentListQuerySchema.parse(req.query);

  const comments = await prisma.productComment.findMany({
    where: { productId },
    select: { id: true, content: true, createdAt: true, userId: true },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const hasNext = comments.length > limit;
  const list = comments.slice(0, limit);
  const nextCursor = hasNext ? list[list.length - 1].id : null;

  res.status(200).json({ list, nextCursor });
}

export async function createProductComment(req, res) {
  const { id: productId } = idParamSchema.parse({ id: req.params.productId });
  const { content } = commentBodySchema.parse(req.body);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }

  const comment = await prisma.productComment.create({
    data: { content, productId, userId: req.user.id },
  });

  res.status(201).json(comment);
}

// ── 게시글 댓글 ────────────────────────────────────────────

export async function listArticleComments(req, res) {
  const { id: articleId } = idParamSchema.parse({ id: req.params.articleId });
  const { cursor, limit = 10 } = commentListQuerySchema.parse(req.query);

  const comments = await prisma.articleComment.findMany({
    where: { articleId },
    select: { id: true, content: true, createdAt: true, userId: true },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const hasNext = comments.length > limit;
  const list = comments.slice(0, limit);
  const nextCursor = hasNext ? list[list.length - 1].id : null;

  res.status(200).json({ list, nextCursor });
}

export async function createArticleComment(req, res) {
  const { id: articleId } = idParamSchema.parse({ id: req.params.articleId });
  const { content } = commentBodySchema.parse(req.body);

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  const comment = await prisma.articleComment.create({
    data: { content, articleId, userId: req.user.id },
  });

  res.status(201).json(comment);
}

// ── 게시글 댓글 수정 / 삭제 (/comments/:id, 본인만) ──────────
// 프론트엔드(articleApi)가 /comments/:id 로 게시글 댓글을 수정·삭제합니다.

export async function updateComment(req, res) {
  const { id } = commentIdParamSchema.parse(req.params);
  const { content } = commentBodySchema.parse(req.body);

  const comment = await prisma.articleComment.findUnique({ where: { id } });
  if (!comment) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }
  if (comment.userId !== req.user.id) {
    return res.status(403).json({ message: "수정 권한이 없습니다." });
  }

  const updated = await prisma.articleComment.update({
    where: { id },
    data: { content },
  });
  res.status(200).json(updated);
}

export async function deleteComment(req, res) {
  const { id } = commentIdParamSchema.parse(req.params);

  const comment = await prisma.articleComment.findUnique({ where: { id } });
  if (!comment) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }
  if (comment.userId !== req.user.id) {
    return res.status(403).json({ message: "삭제 권한이 없습니다." });
  }

  await prisma.articleComment.delete({ where: { id } });
  res.status(204).send();
}
