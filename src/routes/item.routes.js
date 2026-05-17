// ============================================
// 중고마켓 페이지 라우트
// - 상품 및 댓글 조회, 생성, 수정, 삭제
// ============================================

import express from "express";

import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import {
  getAllProductComments,
  createProductComment,
  updateProductComment,
  deleteProductComment
} from "../controllers/productComment.controller.js";

const router = express.Router();

/** ======== 상품 라우트 ======== */
// GET /items
router.get("/", getAllProducts);
// GET /items/:id
router.get("/:id", getProduct);
// POST /items
router.post("/", createProduct);
// PATCH /items/:id
router.patch("/:id", updateProduct);
// DELETE /items/:id
router.delete("/:id", deleteProduct);

/** ======== 상품 댓글 라우트 ======== */
// GET /items/:productId/comments
router.get("/:productId/comments", getAllProductComments);
// POST /items/:productId/comments
router.post("/:productId/comments", createProductComment);
// PATCH /items/:productId/comments/:commentId
router.patch("/:productId/comments/:commentId", updateProductComment);
// DELETE /items/:productId/comments/:commentId
router.delete("/:productId/comments/:commentId", deleteProductComment);

export default router;
