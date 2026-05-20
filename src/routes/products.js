// 상품 API 모음

import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import {
  createProductComment,
  deleteComment,
  getProductComments,
  updateComment,
} from "../controllers/comment.controller.js";

const router = express.Router(); // 요청을 받을 app 대리인

// 상품 등록
router.post("/", createProduct);

// 상품 목록 조회
router.get("/", getAllProducts);
// 상품 상세 페이지 조회
router.get("/:id", getProduct);

// 상품 수정
router.patch("/:id", updateProduct);

// 상품 삭제
router.delete("/:id", deleteProduct);

// 상품 댓글 등록
router.post("/:id/comments", createProductComment);

// 상품 댓글 목록 조회
router.get("/:id/comments", getProductComments);

// 댓글 수정
router.patch("/:id/comments/:commentId", updateComment);

// 댓글 삭제
router.delete("/:id/comments/:commentId", deleteComment);

export default router;
