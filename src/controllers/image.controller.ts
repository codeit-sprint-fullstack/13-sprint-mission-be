// ============================================================
// Image 컨트롤러
// ============================================================
import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/errors.js";

/** 이미지 업로드 컨트롤러 */
async function uploadImage(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    throw new AppError("이미지 파일이 없습니다.", 400);
  }

  const filename = req.file.filename;
  const path = `${req.protocol}://${req.get("host")}/download-images/${filename}`;
  res.json({ success: true, data: { path } });
}

export default { uploadImage };
