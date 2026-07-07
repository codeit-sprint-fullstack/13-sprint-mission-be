import express from "express";
import { commentCreateSchema } from "../../prisma/commentSchema.js";
import { productCreateSchema } from "../../prisma/productSchema.js";
import commentController from "../controllers/commentController.js";
import likeController from "../controllers/likeController.js";
import productController from "../controllers/productController.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import validate from "../middlewares/validate.js";

const productRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: 상품 API
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: 상품 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 상세
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 상품을 찾을 수 없음
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: 상품 등록
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: 등록된 상품
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: 인증 필요
 */
productRouter
  .route("/")
  .get(auth.attachUserIfPresent, productController.getAll)
  .post(
    auth.verifyAccessToken,
    validate(productCreateSchema),
    productController.create,
  );

/**
 * @swagger
 * /product/upload:
 *   post:
 *     summary: 상품 이미지 업로드
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 업로드된 이미지 경로
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   example: /uploads/1735999999999.jpg
 *       400:
 *         description: 이미지 파일 누락
 *       401:
 *         description: 인증 필요
 */
productRouter.post(
  "/upload",
  auth.verifyAccessToken,
  upload.single("image"),
  productController.uploadImage,
);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: 상품 수정
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: 수정된 상품
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 접근 제한 (소유자가 아님)
 */

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 접근 제한 (소유자가 아님)
 */
productRouter
  .route("/:id")
  .get(auth.attachUserIfPresent, productController.getById)
  .put(auth.verifyAccessToken, auth.verifyProductAuth, productController.update)
  .patch(
    auth.verifyAccessToken,
    auth.verifyProductAuth,
    productController.update,
  )
  .delete(
    auth.verifyAccessToken,
    auth.verifyProductAuth,
    productController.deleteById,
  );

/**
 * @swagger
 * /product/{id}/like:
 *   post:
 *     summary: 상품 좋아요
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: 좋아요 등록됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 *       401:
 *         description: 인증 필요
 *       409:
 *         description: 이미 좋아요를 누른 상품
 */

/**
 * @swagger
 * /product/{id}/like:
 *   delete:
 *     summary: 상품 좋아요 취소
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 좋아요 취소됨
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 좋아요를 누르지 않은 상품
 */
productRouter
  .route("/:id/favorite")
  .post(auth.verifyAccessToken, likeController.likeProduct)
  .delete(auth.verifyAccessToken, likeController.unlikeProduct);

/**
 * @swagger
 * /products/{id}/comments:
 *   get:
 *     summary: 상품 댓글 목록 조회
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 목록
 *   post:
 *     summary: 상품 댓글 등록
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: 등록된 댓글
 *       401:
 *         description: 인증 필요
 */
productRouter
  .route("/:id/comments")
  .get(commentController.getAllByProduct)
  .post(
    auth.verifyAccessToken,
    (req, res, next) => {
      req.body = { ...req.body, productId: Number(req.params.id) };
      next();
    },
    validate(commentCreateSchema),
    commentController.create,
  );

export default productRouter;
