// ============================================
// 인증/인가 라우트
// - 회원가입, 로그인, 토큰 갱신
// ============================================

import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.js";

const authRouter = express.Router();

/** ======== 인증/인가 라우트 ======== */

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, nickname, password]
 *             properties:
 *               email: { type: string, format: email }
 *               nickname: { type: string }
 *               password: { type: string, format: password, minLength: 8 }
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
// POST /auth/signup
authRouter.post("/signup", authController.signup);

/**
 * @openapi
 * /auth/signin:
 *   post:
 *     summary: 로그인
 *     description: 로그인 성공 시 refreshToken은 httpOnly 쿠키로 내려가고, accessToken은 응답 바디로 내려갑니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: object
 *                   properties:
 *                     accessToken: { type: string }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
// POST /auth/signin
authRouter.post("/signin", authController.signin);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: 액세스 토큰 갱신
 *     description: 쿠키의 refreshToken을 검증하고, 새 accessToken/refreshToken을 발급합니다.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 갱신 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
// POST /auth/refresh-token
authRouter.post(
  "/refresh-token",
  authMiddleware.verifyRefreshToken,
  authController.refreshToken,
);

export default authRouter;
