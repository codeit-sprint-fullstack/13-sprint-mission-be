const express = require("express");
const router = express.Router();
const ENDPOINTS = require("../constants/endpoints");
const articleController = require("../controllers/articleController");
const commentController = require("../controllers/commentController");

// [게시글 등록 API]
router.post(ENDPOINTS.ARTICLES, articleController.createArticle);

// [게시글 목록 조회 API - 검색, 페이지네이션, 최신순 정렬 포함]
router.get(ENDPOINTS.ARTICLES, articleController.getArticles);

// [게시글 상세 조회 API]
router.get(ENDPOINTS.ARTICLE_BY_ID, articleController.getArticleById);

// [게시글 수정 API]
router.patch(ENDPOINTS.ARTICLE_BY_ID, articleController.updateArticle);

// [게시글 삭제 API]
router.delete(ENDPOINTS.ARTICLE_BY_ID, articleController.deleteArticle);

// [게시글 좋아요 증가 API]
router.post(ENDPOINTS.ARTICLE_FAVORITE, articleController.favoriteArticle);

// =================================================================
// [자유게시판 댓글 API]
// =================================================================

// 1. 게시글 댓글 등록 API
router.post(ENDPOINTS.ARTICLE_COMMENTS, commentController.createComment);

// 2. 게시글 댓글 목록 조회 API (Cursor 페이지네이션)
router.get(ENDPOINTS.ARTICLE_COMMENTS, commentController.getComments);

// 3. 게시글 댓글 수정 API
router.patch(ENDPOINTS.ARTICLE_COMMENT_BY_ID, commentController.updateComment);

// 4. 게시글 댓글 삭제 API
router.delete(ENDPOINTS.ARTICLE_COMMENT_BY_ID, commentController.deleteComment);

module.exports = router;
