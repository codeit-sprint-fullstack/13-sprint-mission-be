// ============================================
// 이미지 라우트
// - 상품/게시글 이미지 업로드
// ============================================
import crypto from "crypto";
import express, { Request } from "express";
import multer from "multer";
import path from "path";

import imageController from "../controllers/image.controller.js";
import authMiddleware from "../middlewares/auth.js";
import { AppError } from "../middlewares/errors.js";

const imageRouter = express.Router();

/** multer (이미지 업로드) */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`);
  },
});

/** 이미지 파일 타입 설정
 * - jpeg, png, gif
 */
const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // 유효한 파일 타입
  } else {
    // 유효하지 않은 파일타입
    cb(new AppError(".jpeg, .png, .gif 파일만 업로드할 수 있습니다.", 400));
  }
};

/** multer 인스턴스 생성
 * - 파일크기 10MB 제한
 */
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB Limit
  },
});

/** ======== 이미지 라우트 ======== */

// POST /images/upload
imageRouter.post(
  "/upload",
  authMiddleware.verifyAccessToken,
  upload.single("image"),
  imageController.uploadImage,
);

export default imageRouter;
