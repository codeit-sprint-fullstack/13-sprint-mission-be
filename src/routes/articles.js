// 게시글 API 모음

import express from "express";
import {
  deleteArticle,
  getAllArticles,
  getArticle,
  postArticle,
  updateArticle,
} from "../controllers/article.controller.js";

const router = express.Router();

// 게시글 등록
router.post("/", postArticle);

// 게시글 목록 조회
router.get("/", getAllArticles);
// 게시글 상세 페이지 조회
router.get("/:id", getArticle);

// 게시글 수정
router.patch("/:id", updateArticle);

// 게시글 삭제
router.delete("/:id", deleteArticle);

export default router;
