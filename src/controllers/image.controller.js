// ============================================================
// Image 컨트롤러
// ============================================================
import { AppError } from "../middlewares/errors.js";

/** 이미지 업로드 컨트롤러 */
async function uploadImage(req, res, next) {
  if (!req.file) {
    throw new AppError("이미지 파일이 없습니다.", 400);
  }

  const filename = req.file.filename;
  const path = `${req.protocol}://${req.get("host")}/download-images/${filename}`;
  res.json({ path });
}

export default { uploadImage };
