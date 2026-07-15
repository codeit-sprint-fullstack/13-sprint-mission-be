import express from "express";
import passport from "#/config/passport.js";
import authController from "#/controllers/authController.js";

const authRouter = express.Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: 회원가입
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, nickname]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               nickname: { type: string }
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/User' }
 *       409:
 *         description: 이미 사용 중인 이메일
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
authRouter.post("/signup", authController.signup);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: 로그인
 *     description: 성공 시 accessToken은 응답 바디로, refreshToken은 httpOnly 쿠키(Set-Cookie)로 내려갑니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *       401:
 *         description: 이메일 또는 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
authRouter.post("/login", authController.login);

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: 액세스/리프레시 토큰 재발급
 *     description: 로그인 시 저장된 refreshToken 쿠키가 필요합니다. DB에 저장된 토큰과 일치할 때만 재발급됩니다.
 *     responses:
 *       200:
 *         description: 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *       401:
 *         description: 인증 실패 또는 토큰 불일치
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
authRouter.post(
  "/refresh-token",
  passport.authenticate("refresh-token", { session: false }),
  authController.refresh,
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: 로그아웃
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204:
 *         description: 로그아웃 성공
 *       401:
 *         description: 인증 필요
 */
authRouter.post(
  "/logout",
  passport.authenticate("access-token", { session: false }),
  authController.logout,
);

export default authRouter;
