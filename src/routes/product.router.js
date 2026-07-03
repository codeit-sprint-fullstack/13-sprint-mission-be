// ============================================
// 중고마켓 페이지 라우트
// - 상품 및 댓글 조회, 생성, 수정, 삭제
// - 상품 좋아요 수 토글
// - 상품 조회, 등록
// ============================================

import express from "express";
import productController from "../controllers/product.controller.js";
import commentController from "../controllers/comment.controller.js";

const productRouter = express.Router();

/** ======== 상품 라우트 ======== */

// GET /products
productRouter.get("/", productController.getAllProducts);

// GET /products/:id
productRouter.get("/:id", productController.getProduct);

// POST /products
productRouter.post("/", productController.createProduct);

// PATCH /products/:id
productRouter.patch("/:id", productController.updateProduct);

// DELETE /products/:id
productRouter.delete("/:id", productController.deleteProduct);

/** ======== 상품 좋아요 라우트 ======== */

// POST /products/:productId/likes
productRouter.post("/:productId/likes", productController.toggleProductLike);

/** ======== 상품 댓글 라우트 ======== */

// GET /products/:productId/comments
productRouter.get(
  "/:productId/comments",
  commentController.getAllProductComments,
);

// POST /products/:productId/comments
productRouter.post(
  "/:productId/comments",
  commentController.createProductComment,
);

export default productRouter;
