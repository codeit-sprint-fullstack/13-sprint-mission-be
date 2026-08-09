import express from "express";
import * as uploadController from "../controllers/upload.controller";
import { imageUpload } from "../utils/upload.util";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router
  .route("/images")
  .post(
    requireAuth,
    imageUpload.array("images", 3),
    uploadController.uploadImages,
  );

export default router;
