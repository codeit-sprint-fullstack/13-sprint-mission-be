import express from "express";
import passport from "#/config/passport.js";
import productController from "#/controllers/productController.js";
import productCommentController from "#/controllers/productCommentController.js";
import { uploadImages } from "#/middlewares/upload.js";
import optionalAuth from "#/middlewares/optionalAuth.js";

const productRouter = express.Router();
const auth = passport.authenticate("access-token", { session: false });

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: 상품 목록 조회
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: orderBy
 *         schema: { type: string, enum: [recent, oldest], default: recent }
 *       - in: query
 *         name: keyword
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProductList' }
 *   post:
 *     tags: [Products]
 *     summary: 상품 등록
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, description]
 *             properties:
 *               name: { type: string, maxLength: 10 }
 *               price: { type: integer, minimum: 0 }
 *               description: { type: string, minLength: 10, maxLength: 100 }
 *               tags: { type: array, items: { type: string, maxLength: 5 } }
 *               images: { type: array, items: { type: string } }
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
 *       400:
 *         description: 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       401:
 *         description: 인증 필요
 */
productRouter
  .route("/")
  .get(productController.getProducts)
  .post(auth, productController.createProduct);

/**
 * @openapi
 * /products/images:
 *   post:
 *     tags: [Products]
 *     summary: 상품 이미지 업로드 (최대 5장, jpg/png/gif/webp, 5MB 이하)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 images: { type: array, items: { type: string } }
 *       401:
 *         description: 인증 필요
 */
productRouter.post("/images", auth, uploadImages, productController.uploadImages);

/**
 * @openapi
 * /products/comments/{id}:
 *   patch:
 *     tags: [ProductComments]
 *     summary: 상품 댓글 수정
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string, maxLength: 500 }
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Comment' }
 *       403:
 *         description: 수정 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 *   delete:
 *     tags: [ProductComments]
 *     summary: 상품 댓글 삭제
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       403:
 *         description: 삭제 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 */
productRouter
  .route("/comments/:id")
  .patch(auth, productCommentController.updateComment)
  .delete(auth, productCommentController.deleteComment);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: 상품 상세 조회
 *     description: 로그인 상태면 응답에 isLiked가 포함됩니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: 상품을 찾을 수 없음
 *   patch:
 *     tags: [Products]
 *     summary: 상품 수정 (작성자만 가능)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, maxLength: 10 }
 *               price: { type: integer, minimum: 0 }
 *               description: { type: string, minLength: 10, maxLength: 100 }
 *               tags: { type: array, items: { type: string } }
 *               images: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *       403:
 *         description: 수정 권한 없음
 *       404:
 *         description: 상품을 찾을 수 없음
 *   delete:
 *     tags: [Products]
 *     summary: 상품 삭제 (작성자만 가능)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       403:
 *         description: 삭제 권한 없음
 *       404:
 *         description: 상품을 찾을 수 없음
 */
productRouter
  .route("/:id")
  .get(optionalAuth, productController.getProductById)
  .patch(auth, productController.updateProduct)
  .delete(auth, productController.deleteProduct);

/**
 * @openapi
 * /products/{id}/like:
 *   post:
 *     tags: [Products]
 *     summary: 상품 좋아요
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 좋아요 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 favoriteCount: { type: integer }
 *       404:
 *         description: 상품을 찾을 수 없음
 *   delete:
 *     tags: [Products]
 *     summary: 상품 좋아요 취소
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 좋아요 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 favoriteCount: { type: integer }
 */
productRouter
  .route("/:id/like")
  .post(auth, productController.likeProduct)
  .delete(auth, productController.unlikeProduct);

/**
 * @openapi
 * /products/{productId}/comments:
 *   get:
 *     tags: [ProductComments]
 *     summary: 상품 댓글 목록 조회 (커서 기반 페이지네이션)
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: cursor
 *         schema: { type: string }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CommentList' }
 *   post:
 *     tags: [ProductComments]
 *     summary: 상품 댓글 등록
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, maxLength: 500 }
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
 *       404:
 *         description: 상품을 찾을 수 없음
 */
productRouter
  .route("/:productId/comments")
  .get(productCommentController.getComments)
  .post(auth, productCommentController.createComment);

export default productRouter;
