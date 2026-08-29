import multer, { type FileFilterCallback, type StorageEngine } from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { randomUUID } from "crypto";
import type { Request } from "express";
import env from "../config/env";
import s3Client, { buildObjectKey } from "../utils/s3";

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일만 업로드할 수 있습니다."));
  }
}

// 배포 환경에서는 S3에, 로컬 개발에서는 uploads 폴더에 저장한다.
// 저장 위치만 갈아끼우고 라우터·컨트롤러는 그대로 두기 위해 StorageEngine 단위로 분기한다.
function createStorage(): StorageEngine {
  if (env.upload.driver === "s3") {
    return multerS3({
      s3: s3Client,
      bucket: env.aws.bucket!,
      // ACL은 지정하지 않는다. 요즘 S3 버킷은 기본적으로 객체 ACL이 비활성(Bucket owner
      // enforced)이라 acl을 넘기면 오히려 업로드가 실패한다. 공개 여부는 버킷 정책으로 정한다.
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (_req, file, cb) => {
        cb(null, buildObjectKey(file.originalname));
      },
    });
  }

  return multer.diskStorage({
    destination: (
      _req: Request,
      _file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      cb(null, "uploads");
    },
    filename: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      const ext = path.extname(file.originalname);
      cb(null, `${randomUUID()}${ext}`);
    },
  });
}

const upload = multer({
  storage: createStorage(),
  fileFilter,
  limits: { fileSize: env.upload.maxFileSize },
});

export default upload;
