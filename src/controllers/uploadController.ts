import type { Request, Response } from "express";
import env from "../config/env";
import { buildPublicUrl, createPresignedUploadUrl } from "../utils/s3";
import { presignedUploadSchema } from "../validators/uploadValidators";

// multer-s3를 쓰면 파일 객체에 location(공개 URL)과 key(S3 객체 키)가 추가로 붙는다.
// 로컬 diskStorage에는 filename만 있으므로, 두 경우를 함께 받을 수 있는 타입으로 둔다.
type UploadedFile = Express.Multer.File & { location?: string; key?: string };

function toFileUrl(req: Request, file: UploadedFile): string {
  if (env.upload.driver === "s3") {
    return file.location ?? buildPublicUrl(file.key!);
  }
  return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
}

/** 기본 요구사항: multer(-s3)로 서버를 거쳐 업로드한다. */
export async function uploadImages(req: Request, res: Response): Promise<void> {
  const files = req.files as UploadedFile[] | undefined;

  if (!files || files.length === 0) {
    res.status(400).json({ message: "이미지 파일이 필요합니다." });
    return;
  }

  const urls = files.map((file) => toFileUrl(req, file));
  res.status(201).json({ urls });
}

/**
 * 심화 요구사항: Presigned URL 발급.
 * 클라이언트는 받은 uploadUrl로 직접 PUT 한 뒤, fileUrl을 상품 등록에 사용한다.
 */
export async function issuePresignedUrls(req: Request, res: Response): Promise<void> {
  if (env.upload.driver !== "s3") {
    res.status(503).json({ message: "Presigned URL은 S3 업로드 모드에서만 사용할 수 있습니다." });
    return;
  }

  const { files } = presignedUploadSchema.parse(req.body);

  const uploads = await Promise.all(
    files.map((file) => createPresignedUploadUrl(file.filename, file.contentType))
  );

  res.status(201).json({ uploads, expiresIn: env.aws.presignExpires });
}
