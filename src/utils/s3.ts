import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";
import env from "../config/env";

// 자격 증명을 코드에서 직접 넘기지 않는 것이 핵심이다.
// AWS SDK가 기본 자격 증명 체인(환경 변수 → ~/.aws/credentials → EC2 IAM Role)을 따라
// 알아서 찾아오므로, EC2에서는 IAM Role만 붙이면 액세스 키를 서버에 두지 않아도 된다.
const s3Client = new S3Client({ region: env.aws.region });

/** 업로드될 객체의 S3 키를 만든다. 원본 파일명은 충돌·한글 인코딩 문제가 있어 UUID로 바꾼다. */
export function buildObjectKey(originalName: string, prefix = "products"): string {
  const ext = path.extname(originalName).toLowerCase();
  return `${prefix}/${randomUUID()}${ext}`;
}

/** S3에 올라간 객체를 브라우저가 조회할 수 있는 공개 URL. */
export function buildPublicUrl(key: string): string {
  return `https://${env.aws.bucket}.s3.${env.aws.region}.amazonaws.com/${key}`;
}

/**
 * 심화 요구사항: Presigned URL.
 * 서버는 "이 키로 PUT 해도 좋다"는 서명된 주소만 발급하고, 실제 파일은
 * 브라우저에서 S3로 직접 올라간다. 파일이 EC2를 경유하지 않으므로
 * 메모리가 작은 프리티어 인스턴스에서 특히 유리하다.
 */
export async function createPresignedUploadUrl(
  originalName: string,
  contentType: string
): Promise<{ key: string; uploadUrl: string; fileUrl: string }> {
  const key = buildObjectKey(originalName);

  const command = new PutObjectCommand({
    Bucket: env.aws.bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: env.aws.presignExpires,
  });

  return { key, uploadUrl, fileUrl: buildPublicUrl(key) };
}

export default s3Client;
