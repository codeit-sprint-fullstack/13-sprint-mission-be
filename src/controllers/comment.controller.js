import prisma from "../config/prisma.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../middlewares/errorHandler.js";

const writerSelect = { select: { id: true, nickname: true, image: true } };

function toCommentResponse({ user, ...comment }) {
  return { ...comment, writer: user };
}

// 게시글 댓글 등록
// 요구사항(댓글 기능 인가): "로그인한 사용자만 게시글에 댓글을 등록할 수 있습니다."
export const createArticleComment = async (req, res) => {
  const { articleId } = req.params;
  const parsedArticleId = parseInt(articleId);
  if (isNaN(parsedArticleId)) {
    throw new BadRequestError("articleId는 숫자여야 합니다");
  }

  const article = await prisma.article.findUnique({
    where: { id: parsedArticleId },
  });
  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다");
  }

  const { content } = req.body;
  const comment = await prisma.articleComment.create({
    data: { content, articleId: parsedArticleId, userId: req.auth.userId },
    include: { user: writerSelect },
  });

  res.status(201).json(toCommentResponse(comment));
};

// 게시글 댓글 목록 조회 (cursor 페이지네이션)
export const getArticleComments = async (req, res) => {
  const { articleId } = req.params;
  const { cursor, limit = "10" } = req.query;
  const parsedArticleId = parseInt(articleId);
  const pageLimit = parseInt(limit);
  if (isNaN(parsedArticleId)) {
    throw new BadRequestError("articleId는 숫자여야 합니다");
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
    include: { user: writerSelect },
  });

  let nextCursor = null;
  if (comments.length > pageLimit) {
    const nextItem = comments.pop();
    nextCursor = nextItem?.id;
  }

  res.json({ list: comments.map(toCommentResponse), nextCursor });
};

// 상품 댓글 등록
// 요구사항(댓글 기능 인가): "로그인한 사용자만 상품에 댓글을 등록할 수 있습니다."
export const createProductComment = async (req, res) => {
  const { productId } = req.params;
  const parsedProductId = parseInt(productId);
  if (isNaN(parsedProductId)) {
    throw new BadRequestError("productId는 숫자여야 합니다");
  }

  const product = await prisma.product.findUnique({
    where: { id: parsedProductId },
  });
  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다");
  }

  const { content } = req.body;
  const comment = await prisma.productComment.create({
    data: { content, productId: parsedProductId, userId: req.auth.userId },
    include: { user: writerSelect },
  });

  res.status(201).json(toCommentResponse(comment));
};

// 상품 댓글 목록 조회 (cursor 페이지네이션)
export const getProductComments = async (req, res) => {
  const { productId } = req.params;
  const { cursor, limit = "10" } = req.query;
  const parsedProductId = parseInt(productId);
  const pageLimit = parseInt(limit);
  if (isNaN(parsedProductId)) {
    throw new BadRequestError("productId는 숫자여야 합니다");
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
    include: { user: writerSelect },
  });

  let nextCursor = null;
  if (comments.length > pageLimit) {
    const nextItem = comments.pop();
    nextCursor = nextItem?.id;
  }

  res.json({ list: comments.map(toCommentResponse), nextCursor });
};

// PATCH/DELETE /comments/:commentId 는 상품/게시글 댓글 테이블이 분리되어 있어
// commentId 하나로는 어느 테이블 소속인지 알 수 없음 -> 두 테이블을 함께 조회해서 찾음
async function findCommentAnywhere(commentId) {
  const [productComment, articleComment] = await Promise.all([
    prisma.productComment.findUnique({ where: { id: commentId } }),
    prisma.articleComment.findUnique({ where: { id: commentId } }),
  ]);
  if (productComment) return { table: "productComment", comment: productComment };
  if (articleComment) return { table: "articleComment", comment: articleComment };
  return null;
}

// 요구사항(댓글 기능 인가): "댓글을 등록한 사용자만 댓글을 수정하거나 삭제할 수 있습니다."
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const parsedId = parseInt(commentId);
  if (isNaN(parsedId)) {
    throw new BadRequestError("commentId는 숫자여야 합니다");
  }

  const found = await findCommentAnywhere(parsedId);
  if (!found) throw new NotFoundError("댓글을 찾을 수 없습니다");
  if (found.comment.userId !== req.auth.userId) {
    throw new ForbiddenError("본인이 등록한 댓글만 수정할 수 있습니다.");
  }

  const { content } = req.body;
  const updated = await prisma[found.table].update({
    where: { id: parsedId },
    data: { content },
    include: { user: writerSelect },
  });

  res.json(toCommentResponse(updated));
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const parsedId = parseInt(commentId);
  if (isNaN(parsedId)) {
    throw new BadRequestError("commentId는 숫자여야 합니다");
  }

  const found = await findCommentAnywhere(parsedId);
  if (!found) throw new NotFoundError("댓글을 찾을 수 없습니다");
  if (found.comment.userId !== req.auth.userId) {
    throw new ForbiddenError("본인이 등록한 댓글만 삭제할 수 있습니다.");
  }

  await prisma[found.table].delete({ where: { id: parsedId } });
  res.status(204).send();
};