import express from "express";
import * as uploadController from "../controllers/upload.controller.js";
import { imageUpload } from "../utils/upload.util.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/images")
  .post(
    requireAuth,
    imageUpload.array("images", 3),
    uploadController.uploadImages,
  );

export default router;
