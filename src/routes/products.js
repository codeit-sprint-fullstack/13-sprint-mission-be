// 상품 API 모음

import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";

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

export default router;
