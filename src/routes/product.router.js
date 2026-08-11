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

/**
 * @openapi
 * /products:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Product]
 *     security: [{ bearerAuth: [] }]
 *     description: 로그인 없이도 조회 가능. 로그인 시 각 상품에 isLiked가 정확히 채워집니다.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: 상품명/설명 검색어
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [recent, like], default: recent }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Product' }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *   post:
 *     summary: 상품 등록
 *     tags: [Product]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [images, name, price, description, tags]
 *             properties:
 *               images:
 *                 type: array
 *                 items: { type: string, format: uri }
 *                 maxItems: 3
 *               name: { type: string, maxLength: 10 }
 *               price: { type: integer, minimum: 0 }
 *               description: { type: string }
 *               tags:
 *                 type: array
 *                 items: { type: string, maxLength: 5 }
 *     responses:
 *       201:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
// GET /products
productRouter.get(
  "/",
  authMiddleware.verifyAccessTokenOptional,
  productController.getAllProducts,
);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: 상품 단건 조회
 *     tags: [Product]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
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

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     summary: 상품 수정
 *     description: 본인이 등록한 상품만 수정 가능
 *     tags: [Product]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items: { type: string, format: uri }
 *               name: { type: string, maxLength: 10 }
 *               price: { type: integer, minimum: 0 }
 *               description: { type: string }
 *               tags:
 *                 type: array
 *                 items: { type: string, maxLength: 5 }
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     summary: 상품 삭제
 *     description: 본인이 등록한 상품만 삭제 가능
 *     tags: [Product]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 상품이 삭제되었습니다 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
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

/**
 * @openapi
 * /products/{productId}/likes:
 *   post:
 *     summary: 상품 좋아요 토글 (추가/취소)
 *     description: 이미 좋아요를 눌렀으면 취소, 아니면 추가합니다. 로그인 필요.
 *     tags: [Product]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 토글 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     liked: { type: boolean }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
// POST /products/:productId/likes
productRouter.post(
  "/:productId/likes",
  authMiddleware.verifyAccessToken,
  productController.toggleProductLike,
);

/** ======== 상품 댓글 라우트 ======== */

/**
 * @openapi
 * /products/{productId}/comments:
 *   get:
 *     summary: 상품 댓글 목록 조회
 *     tags: [Comment]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Comment' }
 *   post:
 *     summary: 상품 댓글 등록
 *     tags: [Comment]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Comment' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
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

/**
 * @openapi
 * /products/{productId}/comments/{commentId}:
 *   patch:
 *     summary: 상품 댓글 수정
 *     description: 본인이 작성한 댓글만 수정 가능
 *     tags: [Comment]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string }
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Comment' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     summary: 상품 댓글 삭제
 *     description: 본인이 작성한 댓글만 삭제 가능
 *     tags: [Comment]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 댓글이 삭제되었습니다 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
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
