import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// 요구사항(상품 등록): "multer 미들웨어를 사용하여 이미지 업로드 API를 구현해 주세요.
// 업로드된 이미지는 서버에 저장하고, 해당 이미지의 경로를 response 객체에 포함해 반환합니다."
// -> 지금은 로컬 디스크(uploads/)에 저장. 실제 서비스에서는 서버 디스크 용량 한계 때문에
//    AWS S3 등 클라우드 스토리지로 옮기는 게 일반적 (추후 리팩터링 대상)
const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

function imageFileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("이미지 파일만 업로드할 수 있습니다."));
  }
  cb(null, true);
}

export const upload = multer({ storage, fileFilter: imageFileFilter });
