// ============================================
// 유저 라우트
// - 유저 정보 조회
// - 유저 상품/게시글 조회
// - 유저 좋아요 상품/게시글 조회
// ============================================

import express from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.js";

const userRouter = express.Router();

/** ======== 유저 라우트 ======== */

// GET /users/me
userRouter.get("/me", authMiddleware.verifyAccessToken, userController.getMe);

export default userRouter;
