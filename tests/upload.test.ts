import request from "supertest";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import app from "../src/app";
import { authHeader, testUser } from "./fixtures";
import { prismaMock } from "./setup";
import { buildObjectKey, buildPublicUrl, createPresignedUploadUrl } from "../src/utils/s3";
import { presignedUploadSchema } from "../src/validators/uploadValidators";

// 외부 서비스(AWS)에 실제로 붙지 않도록 서명 발급 함수를 통째로 갈아끼운다.
// 테스트가 네트워크·AWS 자격 증명·과금에 의존하지 않게 하는 것이 목적이다.
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(),
}));

const mockedGetSignedUrl = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>;

describe("업로드", () => {
  describe("S3 키·URL 생성", () => {
    test("원본 파일명 대신 UUID 기반 키를 만든다", () => {
      const key = buildObjectKey("내 사진.PNG");

      // 한글 파일명이 그대로 키에 들어가면 URL 인코딩 문제가 생기므로 남아있으면 안 된다.
      expect(key).not.toContain("내 사진");
      expect(key).toMatch(/^products\/[0-9a-f-]{36}\.png$/);
    });

    test("같은 파일명을 두 번 올려도 키가 겹치지 않는다", () => {
      expect(buildObjectKey("photo.jpg")).not.toBe(buildObjectKey("photo.jpg"));
    });

    test("확장자가 없는 파일명도 처리한다", () => {
      expect(buildObjectKey("noext")).toMatch(/^products\/[0-9a-f-]{36}$/);
    });

    test("공개 URL은 버킷·리전을 포함한 S3 주소다", () => {
      expect(buildPublicUrl("products/abc.png")).toBe(
        "https://test-panda-bucket.s3.ap-northeast-2.amazonaws.com/products/abc.png"
      );
    });
  });

  describe("Presigned URL 발급", () => {
    test("서명된 업로드 주소와 최종 파일 주소를 함께 돌려준다", async () => {
      mockedGetSignedUrl.mockResolvedValue("https://signed.example.com/put?X-Amz-Signature=xxx");

      const result = await createPresignedUploadUrl("photo.png", "image/png");

      expect(result.uploadUrl).toBe("https://signed.example.com/put?X-Amz-Signature=xxx");
      expect(result.fileUrl).toBe(buildPublicUrl(result.key));
    });

    test("서명에 버킷·키·Content-Type과 만료 시간이 정확히 실린다", async () => {
      mockedGetSignedUrl.mockResolvedValue("https://signed.example.com/put");

      const result = await createPresignedUploadUrl("photo.png", "image/png");

      expect(mockedGetSignedUrl).toHaveBeenCalledTimes(1);

      const [, command, options] = mockedGetSignedUrl.mock.calls[0];
      expect(command).toBeInstanceOf(PutObjectCommand);
      expect((command as PutObjectCommand).input).toEqual({
        Bucket: "test-panda-bucket",
        Key: result.key,
        ContentType: "image/png",
      });
      // 서명이 무기한 유효하면 유출 시 계속 쓸 수 있으므로 만료가 반드시 걸려야 한다.
      expect(options).toEqual({ expiresIn: 300 });
    });

    test("여러 파일을 요청하면 파일 수만큼 서명을 발급한다", async () => {
      mockedGetSignedUrl.mockResolvedValue("https://signed.example.com/put");

      const results = await Promise.all([
        createPresignedUploadUrl("a.png", "image/png"),
        createPresignedUploadUrl("b.jpg", "image/jpeg"),
      ]);

      expect(mockedGetSignedUrl).toHaveBeenCalledTimes(2);
      expect(results[0].key).not.toBe(results[1].key);
    });
  });

  describe("요청 값 검증", () => {
    test("이미지가 아닌 contentType은 거부한다", () => {
      const result = presignedUploadSchema.safeParse({
        files: [{ filename: "bad.exe", contentType: "application/x-msdownload" }],
      });

      expect(result.success).toBe(false);
    });

    test("이미지 contentType은 통과한다", () => {
      const result = presignedUploadSchema.safeParse({
        files: [{ filename: "ok.png", contentType: "image/png" }],
      });

      expect(result.success).toBe(true);
    });

    test("파일이 3개를 넘으면 거부한다", () => {
      const file = { filename: "a.png", contentType: "image/png" };
      const result = presignedUploadSchema.safeParse({ files: [file, file, file, file] });

      expect(result.success).toBe(false);
    });

    test("빈 배열은 거부한다", () => {
      expect(presignedUploadSchema.safeParse({ files: [] }).success).toBe(false);
    });
  });

  describe("라우트 접근 권한", () => {
    test("비로그인 업로드는 401", async () => {
      const res = await request(app).post("/upload");

      expect(res.status).toBe(401);
    });

    test("비로그인 Presigned 요청은 401", async () => {
      const res = await request(app).post("/upload/presigned").send({ files: [] });

      expect(res.status).toBe(401);
    });

    test("로컬 업로드 모드에서는 Presigned 요청이 503으로 막힌다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(testUser);

      const res = await request(app)
        .post("/upload/presigned")
        .set("Authorization", authHeader())
        .send({ files: [{ filename: "a.png", contentType: "image/png" }] });

      expect(res.status).toBe(503);
    });
  });
});
