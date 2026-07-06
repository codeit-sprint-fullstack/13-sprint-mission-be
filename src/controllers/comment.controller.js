import prisma from "../config/prisma.js";
import { BadRequestError as ValidationError, NotFoundError } from "../middlewares/errorHandler.js";

// 게시글 댓글 등록
export const createArticleComment = async (req, res) => {
  const { articleId } = req.params;
  const parsedArticleId = parseInt(articleId);

  if (isNaN(parsedArticleId)) {
    throw new ValidationError("articleId는 숫자여야 합니다");
  }

  const { content } = req.validatedData;

  const article = await prisma.article.findUnique({
    where: { id: parsedArticleId },
  });

  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다");
  }

  const comment = await prisma.articleComment.create({
    data: { content, articleId: parsedArticleId },
  });

  res.status(201).json({ success: true, data: comment });
};

// 게시글 댓글 수정
export const updateArticleComment = async (req, res) => {
  const { articleId, commentId } = req.params;
  const parsedArticleId = parseInt(articleId);
  const parsedCommentId = parseInt(commentId);

  if (isNaN(parsedArticleId) || isNaN(parsedCommentId)) {
    throw new ValidationError("id는 숫자여야 합니다");
  }

  const comment = await prisma.articleComment.findUnique({
    where: { id: parsedCommentId },
  });

  if (!comment) {
    throw new NotFoundError("댓글을 찾을 수 없습니다");
  }

  if (comment.articleId !== parsedArticleId) {
    throw new ValidationError("해당 게시글의 댓글이 아닙니다");
  }

  const updated = await prisma.articleComment.update({
    where: { id: parsedCommentId },
    data: req.validatedData,
  });

  res.json({ success: true, data: updated });
};

// 게시글 댓글 삭제
export const deleteArticleComment = async (req, res) => {
  const { articleId, commentId } = req.params;
  const parsedArticleId = parseInt(articleId);
  const parsedCommentId = parseInt(commentId);

  if (isNaN(parsedArticleId) || isNaN(parsedCommentId)) {
    throw new ValidationError("id는 숫자여야 합니다");
  }

  const comment = await prisma.articleComment.findUnique({
    where: { id: parsedCommentId },
  });

  if (!comment) {
    throw new NotFoundError("댓글을 찾을 수 없습니다");
  }

  if (comment.articleId !== parsedArticleId) {
    throw new ValidationError("해당 게시글의 댓글이 아닙니다");
  }

  await prisma.articleComment.delete({ where: { id: parsedCommentId } });

  res.status(204).send();
};

// 게시글 댓글 목록 조회 (cursor 페이지네이션)
export const getArticleComments = async (req, res) => {
  const { articleId } = req.params;
  const { cursor, limit = "10" } = req.query;
  const parsedArticleId = parseInt(articleId);
  const pageLimit = parseInt(limit);

  if (isNaN(parsedArticleId)) {
    throw new ValidationError("articleId는 숫자여야 합니다");
  }

  const article = await prisma.article.findUnique({
    where: { id: parsedArticleId },
  });

  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다");
  }

  const comments = await prisma.articleComment.findMany({
    where: { articleId: parsedArticleId },
    orderBy: { createdAt: "desc" },
    take: pageLimit + 1,
    ...(cursor && { skip: 1, cursor: { id: parseInt(cursor) } }),
    select: { id: true, content: true, createdAt: true },
  });

  let nextCursor = null;
  if (comments.length > pageLimit) {
    const nextItem = comments.pop();
    nextCursor = nextItem?.id;
  }

  res.json({
    success: true,
    data: comments,
    pagination: { nextCursor, hasMore: !!nextCursor },
  });
};

// 상품 댓글 등록
export const createProductComment = async (req, res) => {
  const { productId } = req.params;
  const parsedProductId = parseInt(productId);

  if (isNaN(parsedProductId)) {
    throw new ValidationError("productId는 숫자여야 합니다");
  }

  const { content } = req.validatedData;

  const product = await prisma.product.findUnique({
    where: { id: parsedProductId },
  });

  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다");
  }

  const comment = await prisma.productComment.create({
    data: { content, productId: parsedProductId },
  });

  res.status(201).json({ success: true, data: comment });
};

// 상품 댓글 수정
export const updateProductComment = async (req, res) => {
  const { productId, commentId } = req.params;
  const parsedProductId = parseInt(productId);
  const parsedCommentId = parseInt(commentId);

  if (isNaN(parsedProductId) || isNaN(parsedCommentId)) {
    throw new ValidationError("id는 숫자여야 합니다");
  }

  const comment = await prisma.productComment.findUnique({
    where: { id: parsedCommentId },
  });

  if (!comment) {
    throw new NotFoundError("댓글을 찾을 수 없습니다");
  }

  if (comment.productId !== parsedProductId) {
    throw new ValidationError("해당 상품의 댓글이 아닙니다");
  }

  const updated = await prisma.productComment.update({
    where: { id: parsedCommentId },
    data: req.validatedData,
  });

  res.json({ success: true, data: updated });
};

// 상품 댓글 삭제
export const deleteProductComment = async (req, res) => {
  const { productId, commentId } = req.params;
  const parsedProductId = parseInt(productId);
  const parsedCommentId = parseInt(commentId);

  if (isNaN(parsedProductId) || isNaN(parsedCommentId)) {
    throw new ValidationError("id는 숫자여야 합니다");
  }

  const comment = await prisma.productComment.findUnique({
    where: { id: parsedCommentId },
  });

  if (!comment) {
    throw new NotFoundError("댓글을 찾을 수 없습니다");
  }

  if (comment.productId !== parsedProductId) {
    throw new ValidationError("해당 상품의 댓글이 아닙니다");
  }

  await prisma.productComment.delete({ where: { id: parsedCommentId } });

  res.status(204).send();
};

// 상품 댓글 목록 조회 (cursor 페이지네이션)
export const getProductComments = async (req, res) => {
  const { productId } = req.params;
  const { cursor, limit = "10" } = req.query;
  const parsedProductId = parseInt(productId);
  const pageLimit = parseInt(limit);

  if (isNaN(parsedProductId)) {
    throw new ValidationError("productId는 숫자여야 합니다");
  }

  const product = await prisma.product.findUnique({
    where: { id: parsedProductId },
  });

  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다");
  }

  const comments = await prisma.productComment.findMany({
    where: { productId: parsedProductId },
    orderBy: { createdAt: "desc" },
    take: pageLimit + 1,
    ...(cursor && { skip: 1, cursor: { id: parseInt(cursor) } }),
    select: { id: true, content: true, createdAt: true },
  });

  let nextCursor = null;
  if (comments.length > pageLimit) {
    const nextItem = comments.pop();
    nextCursor = nextItem?.id;
  }

  res.json({
    success: true,
    data: comments,
    pagination: { nextCursor, hasMore: !!nextCursor },
  });
};
