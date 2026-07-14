import express from "express";
import { articleCreateSchema } from "../../prisma/articleSchema.js";
import { commentCreateSchema } from "../../prisma/commentSchema.js";
import articleController from "../controllers/articleController.js";
import commentController from "../controllers/commentController.js";
import likeController from "../controllers/likeController.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import validate from "../middlewares/validate.js";

const articleRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Article
 *   description: 자유게시판 API
 */

/**
 * @swagger
 * /article:
 *   get:
 *     summary: 게시글 목록 조회
 *     tags: [Article]
 *     responses:
 *       200:
 *         description: 게시글 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /article:
 *   post:
 *     summary: 게시글 등록
 *     tags: [Article]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: 등록된 게시글
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       401:
 *         description: 인증 필요
 */
articleRouter
  .route("/")
  .get(auth.attachUserIfPresent, articleController.getAll)
  .post(
    auth.verifyAccessToken,
    validate(articleCreateSchema),
    articleController.create,
  );

/**
 * @swagger
 * /article/{id}:
 *   get:
 *     summary: 게시글 상세 조회
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글 상세
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: 게시글을 찾을 수 없음
 */

/**
 * @swagger
 * /article/upload:
 *   post:
 *     summary: 게시글 이미지 업로드
 *     tags: [Article]
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
articleRouter.post(
  "/upload",
  auth.verifyAccessToken,
  upload.single("image"),
  articleController.uploadImage,
);

/**
 * @swagger
 * /article/{id}:
 *   put:
 *     summary: 게시글 수정
 *     tags: [Article]
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
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: 수정된 게시글
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 접근 제한 (소유자가 아님)
 */

/**
 * @swagger
 * /article/{id}:
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Article]
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
articleRouter
  .route("/:id")
  .get(auth.attachUserIfPresent, articleController.getById)
  .put(auth.verifyAccessToken, auth.verifyArticleAuth, articleController.update)
  .patch(
    auth.verifyAccessToken,
    auth.verifyArticleAuth,
    articleController.update,
  )
  .delete(
    auth.verifyAccessToken,
    auth.verifyArticleAuth,
    articleController.deleteById,
  );

/**
 * @swagger
 * /article/{id}/like:
 *   post:
 *     summary: 게시글 좋아요
 *     tags: [Article]
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
 *         description: 이미 좋아요를 누른 게시글
 */

/**
 * @swagger
 * /article/{id}/like:
 *   delete:
 *     summary: 게시글 좋아요 취소
 *     tags: [Article]
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
 *         description: 좋아요를 누르지 않은 게시글
 */
articleRouter
  .route("/:id/like")
  .post(auth.verifyAccessToken, likeController.likeArticle)
  .delete(auth.verifyAccessToken, likeController.unlikeArticle);

/**
 * @swagger
 * /articles/{id}/comments:
 *   get:
 *     summary: 게시글 댓글 목록 조회
 *     tags: [Article]
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
 *     summary: 게시글 댓글 등록
 *     tags: [Article]
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
articleRouter
  .route("/:id/comments")
  .get(commentController.getAllByArticle)
  .post(
    auth.verifyAccessToken,
    (req, res, next) => {
      req.body = { ...req.body, articleId: Number(req.params.id) };
      next();
    },
    validate(commentCreateSchema),
    commentController.create,
  );

export default articleRouter;
