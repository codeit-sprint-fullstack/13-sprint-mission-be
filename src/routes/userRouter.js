import express from "express";
import userController from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 유저/인증 API
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 회원가입
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, nickName, encryptedpassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: panda@example.com
 *               nickName:
 *                 type: string
 *                 example: 판다
 *               encryptedpassword:
 *                 type: string
 *                 example: password1234
 *     responses:
 *       201:
 *         description: 생성된 유저
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 필수 값 누락
 *       409:
 *         description: 이미 존재하는 유저
 */
userRouter.post("/users", userController.signUp);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 로그인
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, encryptedpassword]
 *             properties:
 *               email:
 *                 type: string
 *                 example: panda@example.com
 *               encryptedpassword:
 *                 type: string
 *                 example: password1234
 *     responses:
 *       200:
 *         description: 로그인 성공 (refreshToken은 쿠키로 전달됨)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       400:
 *         description: 필수 값 누락
 *       401:
 *         description: 인증 실패
 */
userRouter.post("/login", userController.login);

/**
 * @swagger
 * /token/refresh:
 *   post:
 *     summary: 토큰 재발급
 *     tags: [User]
 *     description: refreshToken 쿠키가 필요합니다.
 *     responses:
 *       200:
 *         description: 재발급된 accessToken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: 인증 실패
 */
userRouter.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  userController.refreshToken,
);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 유저 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 존재하지 않는 유저
 */
userRouter.get("/users/me", auth.verifyAccessToken, userController.getMe);

export default userRouter;
