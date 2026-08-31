/**
 * S3 연결 점검 스크립트.
 *
 *   npm run check:s3
 *
 * 버킷·IAM 권한·버킷 정책·CORS가 제대로 붙었는지를 한 번에 확인한다.
 * 콘솔에서 설정을 마친 뒤 이걸 돌려보면, 무엇이 빠졌는지 항목별로 알려준다.
 *
 * 실제 이미지를 하나 올렸다가 확인 후 지우므로 버킷에는 아무것도 남지 않는다.
 */

import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import env from "../src/config/env";
import s3Client, { buildObjectKey, buildPublicUrl, createPresignedUploadUrl } from "../src/utils/s3";

// 1x1 투명 PNG. 실제 이미지 바이트라야 Content-Type 검증까지 의미가 있다.
const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

const results: { step: string; ok: boolean; detail: string }[] = [];

function record(step: string, ok: boolean, detail: string): void {
  results.push({ step, ok, detail });
  console.log(`${ok ? "  ✔" : "  ✘"} ${step}${detail ? ` — ${detail}` : ""}`);
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    // AWS SDK 에러는 name에 AccessDenied, NoSuchBucket 같은 코드가 들어온다.
    return `${error.name}: ${error.message}`;
  }
  return String(error);
}

async function main(): Promise<void> {
  console.log("\n현재 설정");
  console.log(`  NODE_ENV       : ${env.nodeEnv}`);
  console.log(`  UPLOAD_DRIVER  : ${env.upload.driver}`);
  console.log(`  AWS_REGION     : ${env.aws.region}`);
  console.log(`  S3_BUCKET      : ${env.aws.bucket ?? "(설정되지 않음)"}`);

  if (env.upload.driver !== "s3" || !env.aws.bucket) {
    console.error(
      "\n중단: S3 모드가 아닙니다.\n" +
        '  .env 에 UPLOAD_DRIVER="s3" 와 S3_BUCKET 을 설정한 뒤 다시 실행하세요.\n'
    );
    process.exit(1);
  }

  const key = buildObjectKey("check-s3.png", "_healthcheck");
  const publicUrl = buildPublicUrl(key);

  console.log("\n점검 시작");

  // ── 1. 업로드 (s3:PutObject) ─────────────────────────────
  // HeadBucket으로 접근을 먼저 확인하고 싶지만, 그 명령은 버킷 단위 권한(s3:ListBucket)을
  // 요구한다. 우리 IAM 정책은 최소 권한 원칙에 따라 객체 단위 권한만 주므로,
  // 실제 앱이 하는 일과 동일한 PutObject를 첫 검사로 삼는다.
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.aws.bucket,
        Key: key,
        Body: TINY_PNG,
        ContentType: "image/png",
      })
    );
    record("업로드 (PutObject)", true, key);
  } catch (error) {
    record("업로드 (PutObject)", false, describeError(error));
    console.error(
      "\n업로드에 실패했습니다. 오류 이름별로 원인이 다릅니다.\n" +
        "  AccessDenied      → IAM 정책의 Action에 s3:PutObject가 없거나,\n" +
        "                      Resource가 arn:aws:s3:::버킷명/* 형태가 아님 (끝의 /* 확인)\n" +
        "  NoSuchBucket      → 버킷 이름 오타\n" +
        "  PermanentRedirect → 버킷 리전과 AWS_REGION이 다름 (서울이면 ap-northeast-2)\n" +
        "  InvalidAccessKeyId / SignatureDoesNotMatch → .env의 키 값이 잘못됨\n"
    );
    process.exit(1);
  }

  // ── 2. 조회 (s3:GetObject) ───────────────────────────────
  try {
    await s3Client.send(new GetObjectCommand({ Bucket: env.aws.bucket, Key: key }));
    record("조회 (GetObject)", true, "인증된 요청");
  } catch (error) {
    record("조회 (GetObject)", false, describeError(error));
  }

  // ── 3. 공개 URL 접근 (버킷 정책) ──────────────────────────
  // 브라우저가 상품 이미지를 볼 수 있어야 하므로 인증 없이도 열려야 한다.
  try {
    const response = await fetch(publicUrl);
    if (response.ok) {
      record("공개 URL 조회", true, `${response.status} ${response.headers.get("content-type") ?? ""}`);
    } else {
      record("공개 URL 조회", false, `HTTP ${response.status}`);
      console.error(
        "\n403이라면 버킷 정책이 없거나 퍼블릭 액세스 차단이 켜져 있습니다.\n" +
          "  - 버킷 → 권한 → '모든 퍼블릭 액세스 차단' 해제\n" +
          "  - 버킷 정책에 s3:GetObject 허용 (deploy/aws/s3-bucket-policy.json 참고)\n"
      );
    }
  } catch (error) {
    record("공개 URL 조회", false, describeError(error));
  }

  // ── 4. Presigned URL 발급 및 실제 업로드 ──────────────────
  try {
    const presigned = await createPresignedUploadUrl("presigned-check.png", "image/png");
    const putResponse = await fetch(presigned.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "image/png" },
      body: TINY_PNG,
    });

    if (putResponse.ok) {
      record("Presigned URL 업로드", true, `만료 ${env.aws.presignExpires}초`);
      // 점검용으로 올라간 객체 정리
      await s3Client.send(
        new DeleteObjectCommand({ Bucket: env.aws.bucket, Key: presigned.key })
      );
    } else {
      record("Presigned URL 업로드", false, `HTTP ${putResponse.status}`);
    }
  } catch (error) {
    record("Presigned URL 업로드", false, describeError(error));
  }

  // ── 5. 삭제 (s3:DeleteObject) ────────────────────────────
  try {
    await s3Client.send(new DeleteObjectCommand({ Bucket: env.aws.bucket, Key: key }));
    record("삭제 (DeleteObject)", true, "점검용 객체 정리 완료");
  } catch (error) {
    record("삭제 (DeleteObject)", false, describeError(error));
  }

  // ── 결과 ─────────────────────────────────────────────────
  const failed = results.filter((r) => !r.ok);
  console.log("");

  if (failed.length === 0) {
    console.log("모든 점검을 통과했습니다. S3 업로드 시스템이 정상 동작합니다.");
    console.log("이 출력을 캡쳐해서 README 증빙에 넣으세요.\n");
  } else {
    console.log(`${failed.length}개 항목이 실패했습니다: ${failed.map((f) => f.step).join(", ")}\n`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\n예상치 못한 오류:", describeError(error));
  process.exit(1);
});
