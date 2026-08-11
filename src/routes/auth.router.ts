// ============================================
// 인증/인가 라우트
// - 회원가입, 로그인, 토큰 갱신
// ============================================

import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  signUpSchema,
  validateEmailAndPasswordSchema,
} from "../schemas/auth.schema.js";

const authRouter = express.Router();

/** ======== 인증/인가 라우트 ======== */

// POST /auth/signup
authRouter.post("/signup", validate(signUpSchema), authController.signup);

// POST /auth/signin
authRouter.post(
  "/signin",
  validate(validateEmailAndPasswordSchema),
  authController.signin,
);

// POST /auth/refresh-token
authRouter.post(
  "/refresh-token",
  authMiddleware.verifyRefreshToken,
  authController.refreshToken,
);

export default authRouter;
