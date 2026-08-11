// ============================================
// 자유게시판 게시글 라우트
// - 게시글 및 댓글 조회, 생성, 수정, 삭제
// - 게시글 좋아요 수 토글
// - 게시글 조회, 등록
// ============================================

import express from "express";
import articleController from "../controllers/article.controller.js";
import commentController from "../controllers/comment.controller.js";
import authMiddleware from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createArticleSchema,
  updateArticleSchema,
} from "../schemas/article.schemas.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../schemas/comment.schemas.js";

const articleRouter = express.Router();

/** ======== 게시글 라우트 ======== */

// GET /articles
// POST /articles
articleRouter
  .route("/")
  .get(
    authMiddleware.verifyAccessTokenOptional,
    articleController.getAllArticles,
  )
  .post(
    authMiddleware.verifyAccessToken,
    validate(createArticleSchema),
    articleController.createArticle,
  );

// GET /articles/:id
// PATCH /articles/:id
// DELETE /articles/:id
articleRouter
  .route("/:id")
  .get(authMiddleware.verifyAccessTokenOptional, articleController.getArticle)
  .patch(
    authMiddleware.verifyAccessToken,
    validate(updateArticleSchema),
    articleController.updateArticle,
  )
  .delete(authMiddleware.verifyAccessToken, articleController.deleteArticle);

/** ======== 게시글 좋아요 라우트 ======== */

// POST /articles/:articleId/likes
articleRouter.post(
  "/:articleId/likes",
  authMiddleware.verifyAccessToken,
  articleController.toggleArticleLike,
);

/** ======== 게시글 댓글 라우트 ======== */

// GET /articles/:articleId/comments
// POST /articles/:articleId/comments
articleRouter
  .route("/:articleId/comments")
  .get(
    authMiddleware.verifyAccessTokenOptional,
    commentController.getAllArticleComments,
  )
  .post(
    authMiddleware.verifyAccessToken,
    validate(createCommentSchema),
    commentController.createArticleComment,
  );

// PATCH /articles/:articleId/comments/:commentId
// DELETE /articles/:articleId/comments/:commentId
articleRouter
  .route("/:articleId/comments/:commentId")
  .patch(
    authMiddleware.verifyAccessToken,
    validate(updateCommentSchema),
    commentController.updateArticleComment,
  )
  .delete(
    authMiddleware.verifyAccessToken,
    commentController.deleteArticleComment,
  );

export default articleRouter;
