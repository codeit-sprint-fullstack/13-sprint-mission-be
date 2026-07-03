// ============================================
// 유저 라우트
// - 유저 정보 조회
// - 유저 상품/게시글 조회
// - 유저 좋아요 상품/게시글 조회
// ============================================

import express from "express";
import userController from "../controllers/user.controller.js";

const userRouter = express.Router();

/** ======== 유저 라우트 ======== */

// GET /users/me
userRouter.get("/me", userController.getMe);

// GET /users/me/products
userRouter.get("/me/products", userController.getMyProducts);

// GET /users/me/articles
userRouter.get("/me/articles", userController.getMyArticles);

// GET /users/me/likes/products
userRouter.get("/me/likes/products", userController.getMyLikedProducts);

// GET /users/me/likes/articles
userRouter.get("/me/likes/articles", userController.getMyLikedArticles);

export default userRouter;
