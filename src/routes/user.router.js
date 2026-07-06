// ============================================
// 유저 라우트
// - 유저 정보 조회
// - 유저 상품/게시글 조회
// - 유저 좋아요 상품/게시글 조회
// ============================================

import express from "express";
import authMiddleware from "../middlewares/auth.js";
import userController from "../controllers/user.controller.js";

const userRouter = express.Router();

/** ======== 유저 라우트 ======== */

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: 내 프로필 조회
 *     tags: [User]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/User' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
// GET /users/me
userRouter.get("/me", authMiddleware.verifyAccessToken, userController.getMe);

export default userRouter;
