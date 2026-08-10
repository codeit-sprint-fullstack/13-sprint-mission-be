import fs from "fs";
import multer from "multer";
import path from "path";
import type { FileFilterCallback } from "multer";
import type { Request } from "express";
import { HttpError } from "../middlewares/error";
import { uploadDir } from "./env.util";

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadDir);
  },
  filename(req, file, callback) {
    const ext = path.extname(file.originalname || "");
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

function imageFilter(
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) {
  if (!file.mimetype?.startsWith("image/")) {
    callback(new HttpError(400, "Only image files can be uploaded"));
    return;
  }
  callback(null, true);
}

const imageUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { files: 3, fileSize: 5 * 1024 * 1024 },
});

export { imageUpload };
