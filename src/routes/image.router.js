// ============================================
// 이미지 라우트
// - 상품/게시글 이미지 업로드
// ============================================
import express from "express";
import multer from "multer";
import crypto from "crypto";
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
const imageFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // 유효한 파일 타입
  } else {
    // 유효하지 않은 파일타입
    cb(
      new AppError(".jpeg, .png, .gif 파일만 업로드할 수 있습니다.", 400),
      false,
    );
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

/**
 * @openapi
 * /images/upload:
 *   post:
 *     summary: 이미지 업로드
 *     description: 업로드된 이미지는 서버 uploads/ 폴더에 저장되고, 접근 가능한 경로를 반환합니다.
 *     tags: [Image]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: jpeg/png/gif, 최대 10MB
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     path: { type: string, example: /download-images/uuid.jpg }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
// POST /images/upload
imageRouter.post(
  "/upload",
  authMiddleware.verifyAccessToken,
  upload.single("image"),
  imageController.uploadImage,
);

export default imageRouter;
