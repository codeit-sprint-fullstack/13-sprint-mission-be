import * as CommentRepository from "../repositories/comment.repository.js";
import * as productRepository from "../repositories/product.repository.js";
import * as articleRepository from "../repositories/article.repository.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../middlewares/errorHandler.js";

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

  const article = await articleRepository.findByIdSimple(parsedArticleId);
  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다");
  }

  const { content } = req.body;
  const comment = await CommentRepository.createArticleComment({
    content,
    articleId: parsedArticleId,
    userId: req.auth.userId,
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

  const article = await articleRepository.findByIdSimple(parsedArticleId);
  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다");
  }

  const comments = await CommentRepository.findArticleComments({
    articleId: parsedArticleId,
    cursor: cursor ? parseInt(cursor) : undefined,
    take: pageLimit + 1,
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

  const product = await productRepository.findByIdSimple(parsedProductId);
  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다");
  }

  const { content } = req.body;
  const comment = await CommentRepository.createProductComment({
    content,
    productId: parsedProductId,
    userId: req.auth.userId,
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

  const product = await productRepository.findByIdSimple(parsedProductId);
  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다");
  }

  const comments = await CommentRepository.findProductComments({
    productId: parsedProductId,
    cursor: cursor ? parseInt(cursor) : undefined,
    take: pageLimit + 1,
  });

  let nextCursor = null;
  if (comments.length > pageLimit) {
    const nextItem = comments.pop();
    nextCursor = nextItem?.id;
  }

  res.json({ list: comments.map(toCommentResponse), nextCursor });
};

// 요구사항(댓글 기능 인가): "댓글을 등록한 사용자만 댓글을 수정하거나 삭제할 수 있습니다."
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const parsedId = parseInt(commentId);
  if (isNaN(parsedId)) {
    throw new BadRequestError("commentId는 숫자여야 합니다");
  }

  const found = await CommentRepository.findCommentAnywhere(parsedId);
  if (!found) throw new NotFoundError("댓글을 찾을 수 없습니다");
  if (found.comment.userId !== req.auth.userId) {
    throw new ForbiddenError("본인이 등록한 댓글만 수정할 수 있습니다.");
  }

  const { content } = req.body;
  const updated = await CommentRepository.update(found.table, parsedId, content);

  res.json(toCommentResponse(updated));
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const parsedId = parseInt(commentId);
  if (isNaN(parsedId)) {
    throw new BadRequestError("commentId는 숫자여야 합니다");
  }

  const found = await CommentRepository.findCommentAnywhere(parsedId);
  if (!found) throw new NotFoundError("댓글을 찾을 수 없습니다");
  if (found.comment.userId !== req.auth.userId) {
    throw new ForbiddenError("본인이 등록한 댓글만 삭제할 수 있습니다.");
  }

  await CommentRepository.remove(found.table, parsedId);
  res.status(204).send();
};
