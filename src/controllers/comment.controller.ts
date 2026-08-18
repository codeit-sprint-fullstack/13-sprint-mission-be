import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth.js";
import * as commentService from "../services/comment.service.js";
import { BadRequestError } from "../middlewares/errorHandler.js";
import {
  CreateArticleCommentInput,
  CreateProductCommentInput,
  UpdateCommentInput,
} from "../schemas/comment.schema.js";

// 게시글 댓글 등록
// 요구사항(댓글 기능 인가): "로그인한 사용자만 게시글에 댓글을 등록할 수 있습니다."
export const createArticleComment = async (req: AuthenticatedRequest, res: Response) => {
  const { articleId } = req.params as { articleId: string };
  const parsedArticleId = parseInt(articleId);
  if (isNaN(parsedArticleId)) {
    throw new BadRequestError("articleId는 숫자여야 합니다");
  }

  const { content } = req.body as CreateArticleCommentInput;
  const comment = await commentService.createArticleComment(
    parsedArticleId,
    content,
    req.auth.userId,
  );

  res.status(201).json(comment);
};

// 게시글 댓글 목록 조회 (cursor 페이지네이션)
export const getArticleComments = async (req: Request, res: Response) => {
  const { articleId } = req.params as { articleId: string };
  const { cursor, limit = "10" } = req.query as Record<string, string>;
  const parsedArticleId = parseInt(articleId);
  if (isNaN(parsedArticleId)) {
    throw new BadRequestError("articleId는 숫자여야 합니다");
  }

  const result = await commentService.getArticleComments(parsedArticleId, {
    cursor: cursor ? parseInt(cursor) : undefined,
    limit: parseInt(limit),
  });

  res.json(result);
};

// 상품 댓글 등록
// 요구사항(댓글 기능 인가): "로그인한 사용자만 상품에 댓글을 등록할 수 있습니다."
export const createProductComment = async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params as { productId: string };
  const parsedProductId = parseInt(productId);
  if (isNaN(parsedProductId)) {
    throw new BadRequestError("productId는 숫자여야 합니다");
  }

  const { content } = req.body as CreateProductCommentInput;
  const comment = await commentService.createProductComment(
    parsedProductId,
    content,
    req.auth.userId,
  );

  res.status(201).json(comment);
};

// 상품 댓글 목록 조회 (cursor 페이지네이션)
export const getProductComments = async (req: Request, res: Response) => {
  const { productId } = req.params as { productId: string };
  const { cursor, limit = "10" } = req.query as Record<string, string>;
  const parsedProductId = parseInt(productId);
  if (isNaN(parsedProductId)) {
    throw new BadRequestError("productId는 숫자여야 합니다");
  }

  const result = await commentService.getProductComments(parsedProductId, {
    cursor: cursor ? parseInt(cursor) : undefined,
    limit: parseInt(limit),
  });

  res.json(result);
};

// 요구사항(댓글 기능 인가): "댓글을 등록한 사용자만 댓글을 수정하거나 삭제할 수 있습니다."
export const updateComment = async (req: AuthenticatedRequest, res: Response) => {
  const { commentId } = req.params as { commentId: string };
  const parsedId = parseInt(commentId);
  if (isNaN(parsedId)) {
    throw new BadRequestError("commentId는 숫자여야 합니다");
  }

  const { content } = req.body as UpdateCommentInput;
  const updated = await commentService.updateComment(parsedId, req.auth.userId, content);

  res.json(updated);
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  const { commentId } = req.params as { commentId: string };
  const parsedId = parseInt(commentId);
  if (isNaN(parsedId)) {
    throw new BadRequestError("commentId는 숫자여야 합니다");
  }

  await commentService.deleteComment(parsedId, req.auth.userId);
  res.status(204).send();
};
