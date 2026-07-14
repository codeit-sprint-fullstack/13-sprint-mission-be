import { Router } from "express";
import authController from "./auth.controller.js";
import passport from "../../config/passport.js";

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     refreshTokenCookie:
 *       type: apiKey
 *       in: cookie
 *       name: refreshToken
 */

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nickname
 *               - password
 *               - passwordConfirmation
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               nickname:
 *                 type: string
 *                 example: test
 *               password:
 *                 type: string
 *                 example: testtesttest
 *               passwordConfirmation:
 *                 type: string
 *                 example: testtesttest
 *     responses:
 *       '201':
 *         description: 회원가입 성공
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGci...; HttpOnly; SameSite=Lax
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   format: email
 *                 nickname:
 *                   type: string
 *                 image:
 *                   type: string
 *                   nullable: true
 *                 provider:
 *                   type: string
 *                   example: local
 *                 providerId:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 accessToken:
 *                   type: string
 *       '400':
 *         description: 입력 데이터가 올바르지 않음
 *       '409':
 *         description: 이미 사용 중인 이메일
 */
router.post("/signUp", authController.signUp);

/**
 * @swagger
 * /auth/signIn:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: testtesttest
 *     responses:
 *       '200':
 *         description: 로그인 성공
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGci...; HttpOnly; SameSite=Lax
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                   format: email
 *                 nickname:
 *                   type: string
 *                 image:
 *                   type: string
 *                   nullable: true
 *                 provider:
 *                   type: string
 *                 providerId:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 accessToken:
 *                   type: string
 *       '400':
 *         description: 입력 데이터가 올바르지 않음
 *       '401':
 *         description: 이메일 또는 비밀번호가 일치하지 않음
 */
router.post("/signIn", authController.signIn);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: 액세스 토큰 갱신 (JWT sliding session)
 *     description: >
 *     tags: [Auth]
 *     security:
 *       - refreshTokenCookie: []
 *     responses:
 *       '200':
 *         description: 토큰 갱신 성공
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGci...; HttpOnly; SameSite=Lax
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       '401':
 *         description: refreshToken이 없거나 유효하지 않거나 DB에 저장된 값과 일치하지 않음
 */
router.post(
  "/refresh-token",
  passport.authenticate("refresh-token", { session: false }),
  authController.refreshToken,
);

export default router;
