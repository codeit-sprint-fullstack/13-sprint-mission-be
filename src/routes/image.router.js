import { Router } from "express";
import { upload } from "../middlewares/upload.js";
import { uploadImage } from "../controllers/image.controller.js";
import { verifyAccessToken } from "../middlewares/auth.js";

const router = Router();

// POST /images/upload
router.post("/upload", verifyAccessToken, upload.single("image"), uploadImage);

export default router;