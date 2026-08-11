// ============================================
// 중고마켓 페이지 라우트
// - 상품 및 댓글 조회, 생성, 수정, 삭제
// - 상품 좋아요 수 토글
// - 상품 조회, 등록
// ============================================

import express from "express";
import commentController from "../controllers/comment.controller.js";
import productController from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../schemas/comment.schemas.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schemas.js";

const productRouter = express.Router();

/** ======== 상품 라우트 ======== */

// GET /products
productRouter.get(
  "/",
  authMiddleware.verifyAccessTokenOptional,
  productController.getAllProducts,
);

// GET /products/:id
productRouter.get(
  "/:id",
  authMiddleware.verifyAccessTokenOptional,
  productController.getProduct,
);

// POST /products
productRouter.post(
  "/",
  authMiddleware.verifyAccessToken,
  validate(createProductSchema),
  productController.createProduct,
);

// PATCH /products/:id
productRouter.patch(
  "/:id",
  authMiddleware.verifyAccessToken,
  validate(updateProductSchema),
  productController.updateProduct,
);

// DELETE /products/:id
productRouter.delete(
  "/:id",
  authMiddleware.verifyAccessToken,
  productController.deleteProduct,
);

/** ======== 상품 좋아요 라우트 ======== */

// POST /products/:productId/likes
productRouter.post(
  "/:productId/likes",
  authMiddleware.verifyAccessToken,
  productController.toggleProductLike,
);

/** ======== 상품 댓글 라우트 ======== */

// GET /products/:productId/comments
productRouter.get(
  "/:productId/comments",
  authMiddleware.verifyAccessTokenOptional,
  commentController.getAllProductComments,
);

// POST /products/:productId/comments
productRouter.post(
  "/:productId/comments",
  authMiddleware.verifyAccessToken,
  validate(createCommentSchema),
  commentController.createProductComment,
);

// PATCH /products/:productId/comments/:commentId
productRouter.patch(
  "/:productId/comments/:commentId",
  authMiddleware.verifyAccessToken,
  validate(updateCommentSchema),
  commentController.updateProductComment,
);

// DELETE /products/:productId/comments/:commentId
productRouter.delete(
  "/:productId/comments/:commentId",
  authMiddleware.verifyAccessToken,
  commentController.deleteProductComment,
);

export default productRouter;
