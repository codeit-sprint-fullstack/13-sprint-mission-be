// ============================================
// 자유게시판 게시글 라우트
// - 상품 및 댓글 조회, 생성, 수정, 삭제
// ============================================

import express from "express";

import {
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";

import {
  getAllArticleComments,
  createArticleComment,
  updateArticleComment,
  deleteArticleComment,
} from "../controllers/articleComment.controller.js";

const router = express.Router();

/** ======== 게시글 라우트 ======== */
// GET /articles
router.get("/", getAllArticles);
// GET /articles/:id
router.get("/:id", getArticle);
// POST /articles
router.post("/", createArticle);
// PATCH /articles/:id
router.patch("/:id", updateArticle);
// DELETE /articles/:id
router.delete("/:id", deleteArticle);

/** ======== 게시글 댓글 라우트 ======== */
// GET /articles/:articleId/comments
router.get("/:articleId/comments", getAllArticleComments);
// POST /articles/:articleId/comments
router.post("/:articleId/comments", createArticleComment);
// PATCH /articles/:articleId/comments/:commentId
router.patch("/:articleId/comments/:commentId", updateArticleComment);
// DELETE /articles/:articleId/comments/:commentId
router.delete("/:articleId/comments/:commentId", deleteArticleComment);

export default router;
