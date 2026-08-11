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

// GET /products, POST /products
productRouter
  .route("/")
  .get(
    authMiddleware.verifyAccessTokenOptional,
    productController.getAllProducts,
  )
  .post(
    authMiddleware.verifyAccessToken,
    validate(createProductSchema),
    productController.createProduct,
  );

// GET /products/:id
// PATCH /products/:id
// DELETE /products/:id
productRouter
  .route("/:id")
  .get(authMiddleware.verifyAccessTokenOptional, productController.getProduct)
  .patch(
    authMiddleware.verifyAccessToken,
    validate(updateProductSchema),
    productController.updateProduct,
  )
  .delete(authMiddleware.verifyAccessToken, productController.deleteProduct);

/** ======== 상품 좋아요 라우트 ======== */

// POST /products/:productId/likes
productRouter.post(
  "/:productId/likes",
  authMiddleware.verifyAccessToken,
  productController.toggleProductLike,
);

/** ======== 상품 댓글 라우트 ======== */

// GET /products/:productId/comments
// POST /products/:productId/comments
productRouter
  .route("/:productId/comments")
  .get(
    authMiddleware.verifyAccessTokenOptional,
    commentController.getAllProductComments,
  )
  .post(
    authMiddleware.verifyAccessToken,
    validate(createCommentSchema),
    commentController.createProductComment,
  );

// PATCH /products/:productId/comments/:commentId
// DELETE /products/:productId/comments/:commentId
productRouter
  .route("/:productId/comments/:commentId")
  .patch(
    authMiddleware.verifyAccessToken,
    validate(updateCommentSchema),
    commentController.updateProductComment,
  )
  .delete(
    authMiddleware.verifyAccessToken,
    commentController.deleteProductComment,
  );

export default productRouter;
