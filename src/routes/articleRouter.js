import express from "express";
import passport from "#/config/passport.js";
import articleController from "#/controllers/articleController.js";
import articleCommentController from "#/controllers/articleCommentController.js";
import optionalAuth from "#/middlewares/optionalAuth.js";

const articleRouter = express.Router();
const auth = passport.authenticate("access-token", { session: false });

/**
 * @openapi
 * /articles:
 *   get:
 *     tags: [Articles]
 *     summary: 게시글 목록 조회
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: orderBy
 *         schema: { type: string, enum: [recent, oldest, favorite], default: recent }
 *       - in: query
 *         name: keyword
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ArticleList' }
 *   post:
 *     tags: [Articles]
 *     summary: 게시글 등록
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string, maxLength: 10 }
 *               content: { type: string, minLength: 10, maxLength: 500 }
 *     responses:
 *       201:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Article' }
 *       400:
 *         description: 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       401:
 *         description: 인증 필요
 */
articleRouter
  .route("/")
  .get(articleController.getArticles)
  .post(auth, articleController.createArticle);

/**
 * @openapi
 * /articles/comments/{id}:
 *   patch:
 *     tags: [ArticleComments]
 *     summary: 게시글 댓글 수정
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
 *     tags: [ArticleComments]
 *     summary: 게시글 댓글 삭제
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
articleRouter
  .route("/comments/:id")
  .patch(auth, articleCommentController.updateComment)
  .delete(auth, articleCommentController.deleteComment);

/**
 * @openapi
 * /articles/{id}:
 *   get:
 *     tags: [Articles]
 *     summary: 게시글 상세 조회
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
 *             schema: { $ref: '#/components/schemas/Article' }
 *       404:
 *         description: 게시글을 찾을 수 없음
 *   patch:
 *     tags: [Articles]
 *     summary: 게시글 수정 (작성자만 가능)
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
 *               title: { type: string, maxLength: 10 }
 *               content: { type: string, minLength: 10, maxLength: 500 }
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Article' }
 *       403:
 *         description: 수정 권한 없음
 *       404:
 *         description: 게시글을 찾을 수 없음
 *   delete:
 *     tags: [Articles]
 *     summary: 게시글 삭제 (작성자만 가능)
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
 *         description: 게시글을 찾을 수 없음
 */
articleRouter
  .route("/:id")
  .get(optionalAuth, articleController.getArticleById)
  .patch(auth, articleController.updateArticle)
  .delete(auth, articleController.deleteArticle);

/**
 * @openapi
 * /articles/{id}/like:
 *   post:
 *     tags: [Articles]
 *     summary: 게시글 좋아요
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
 *         description: 게시글을 찾을 수 없음
 *   delete:
 *     tags: [Articles]
 *     summary: 게시글 좋아요 취소
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
articleRouter
  .route("/:id/like")
  .post(auth, articleController.likeArticle)
  .delete(auth, articleController.unlikeArticle);

/**
 * @openapi
 * /articles/{articleId}/comments:
 *   get:
 *     tags: [ArticleComments]
 *     summary: 게시글 댓글 목록 조회 (커서 기반 페이지네이션)
 *     parameters:
 *       - in: path
 *         name: articleId
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
 *     tags: [ArticleComments]
 *     summary: 게시글 댓글 등록
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: articleId
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
 *         description: 게시글을 찾을 수 없음
 */
articleRouter
  .route("/:articleId/comments")
  .post(auth, articleCommentController.createComment)
  .get(articleCommentController.getComments);

export default articleRouter;
