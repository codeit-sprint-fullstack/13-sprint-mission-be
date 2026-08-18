// ============================================================
// Comment 컨트롤러
// ============================================================
import { NextFunction, Request, Response } from "express";
import commentService from "../services/comment.service.js";
import { ArticleCommentInput, ProductCommentInput } from "../types/comment.js";
import assertUser from "../utils/assertUser.js";
import parseId from "../utils/parse.js";

/** 상품 댓글 조회
 * - GET /products/:productId/comments
 */
async function getAllProductComments(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) {
  assertUser(req);

  const { data } = await commentService.getAll({
    type: "product",
    id: parseId(req.params.productId),
    userId: req.user.userId,
  });

  res.json({ success: true, data });
}

/** 상품 댓글 생성
 * - POST /products/:productId/comments
 */
async function createProductComment(
  req: Request<{ productId: string }, {}, ProductCommentInput>,
  res: Response,
  next: NextFunction,
) {
  assertUser(req);

  const newProductComment = await commentService.create({
    type: "product",
    id: parseId(req.params.productId),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    ownerId: req.user.userId,
  });

  res.status(201).json({ success: true, data: newProductComment });
}

/** 게시글 댓글 조회
 * - GET /articles/:articleId/comments
 */
async function getAllArticleComments(
  req: Request<{ articleId: string }>,
  res: Response,
  next: NextFunction,
) {
  assertUser(req);

  const { data } = await commentService.getAll({
    type: "article",
    id: parseId(req.params.articleId),
    userId: req.user.userId,
  });

  res.json({ success: true, data });
}

/** 게시글 댓글 생성
 * - POST /articles/:articleId/comments
 */
async function createArticleComment(
  req: Request<{ articleId: string }, {}, ArticleCommentInput>,
  res: Response,
  next: NextFunction,
) {
  assertUser(req);

  const newArticleComment = await commentService.create({
    type: "article",
    id: parseId(req.params.articleId),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    ownerId: req.user.userId,
  });

  res.status(201).json({ success: true, data: newArticleComment });
}

/** 상품 댓글 수정
 * - PATCH /products/:productId/comments/:commentId
 */
async function updateProductComment(
  req: Request<{ commentId: string }, {}, ProductCommentInput>,
  res: Response,
  next: NextFunction,
) {
  assertUser(req);

  const updatedComment = await commentService.update({
    type: "product",
    id: parseId(req.params.commentId),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    userId: req.user.userId,
  });

  res.json({ success: true, data: updatedComment });
}

/** 상품 댓글 삭제
 * - DELETE /products/:productId/comments/:commentId
 */
async function deleteProductComment(
  req: Request<{ commentId: string }>,
  res: Response,
  next: NextFunction,
) {
  assertUser(req);

  await commentService.deleteById({
    type: "product",
    id: parseId(req.params.commentId),
    userId: req.user.userId,
  });

  res.json({ success: true, message: "댓글이 삭제되었습니다" });
}

/** 게시글 댓글 수정
 * - PATCH /articles/:articleId/comments/:commentId
 */
async function updateArticleComment(
  req: Request<{ commentId: string }, {}, ArticleCommentInput>,
  res: Response,
  next: NextFunction,
) {
  assertUser(req);

  const updatedComment = await commentService.update({
    type: "article",
    id: parseId(req.params.commentId),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    userId: req.user.userId,
  });

  res.json({ success: true, data: updatedComment });
}

/** 게시글 댓글 삭제
 * - DELETE /articles/:articleId/comments/:commentId
 */
async function deleteArticleComment(
  req: Request<{ commentId: string }, {}, ArticleCommentInput>,
  res: Response,
  next: NextFunction,
) {
  assertUser(req);

  await commentService.deleteById({
    type: "article",
    id: parseId(req.params.commentId),
    userId: req.user.userId,
  });

  res.json({ success: true, message: "댓글이 삭제되었습니다" });
}

export default {
  getAllProductComments,
  createProductComment,
  getAllArticleComments,
  createArticleComment,
  updateProductComment,
  deleteProductComment,
  updateArticleComment,
  deleteArticleComment,
};
