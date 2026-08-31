import express from "express";
import env from "../config/env";
import upload from "../middlewares/upload";
import { requireAuth } from "../middlewares/auth";
import { uploadImages, issuePresignedUrls } from "../controllers/uploadController";

const router = express.Router();

// 서버를 경유하는 업로드 (multer-s3)
router.post("/", requireAuth, upload.array("images", env.upload.maxFiles), uploadImages);

// 브라우저에서 S3로 직접 올리기 위한 서명 발급 (심화)
router.post("/presigned", requireAuth, issuePresignedUrls);

export default router;
