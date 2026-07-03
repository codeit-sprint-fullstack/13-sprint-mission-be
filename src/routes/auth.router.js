// ============================================
// 인증/인가 라우트
// - 회원가입, 로그인, 토큰 갱신
// ============================================

import express from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = express.Router();

/** ======== 인증/인가 라우트 ======== */

// POST /auth/signup
authRouter.post("/signup", authController.signup);

// POST /auth/signin
authRouter.post("/signin", authController.signin);

// POST /auth/refresh-token
authRouter.post("/refresh-token", authController.refreshToken);

export default authRouter;
