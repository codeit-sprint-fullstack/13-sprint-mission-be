// ============================================
// 자유게시판 게시글 라우트
// - 게시글 및 댓글 조회, 생성, 수정, 삭제
// - 게시글 좋아요 수 토글
// - 게시글 조회, 등록
// ============================================

import express from "express";
import articleController from "../controllers/article.controller.js";
import commentController from "../controllers/comment.controller.js";

const articleRouter = express.Router();

/** ======== 게시글 라우트 ======== */

// GET /articles
articleRouter.get("/", articleController.getAllArticles);

// GET /articles/:id
articleRouter.get("/:id", articleController.getArticle);

// POST /articles
articleRouter.post("/", articleController.createArticle);

// PATCH /articles/:id
articleRouter.patch("/:id", articleController.updateArticle);

// DELETE /articles/:id
articleRouter.delete("/:id", articleController.deleteArticle);

/** ======== 게시글 좋아요 라우트 ======== */

// POST /products/:articleId/likes
articleRouter.post("/:articleId/likes", articleController.toggleArticleLike);

/** ======== 게시글 댓글 라우트 ======== */

// GET /articles/:articleId/comments
articleRouter.get(
  "/:articleId/comments",
  commentController.getAllArticleComments,
);

// POST /articles/:articleId/comments
articleRouter.post(
  "/:articleId/comments",
  commentController.createArticleComment,
);

export default articleRouter;
