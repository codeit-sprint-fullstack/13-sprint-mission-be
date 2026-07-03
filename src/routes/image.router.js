// ============================================
// 이미지 라우트
// - 상품/게시글 이미지 업로드
// ============================================

import express from "express";
import imageController from "../controllers/image.controller.js";

const imageRouter = express.Router();

/** ======== 이미지 라우트 ======== */

// POST /images/upload
imageRouter.post("/upload", imageController.uploadImage);

export default imageRouter;
