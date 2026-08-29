import request from "supertest";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import app from "../src/app";
import errorHandler from "../src/middlewares/errorHandler";
import { prismaMock } from "./setup";
import { authHeader, testUser } from "./fixtures";

// errorHandler는 Express가 마지막에 부르는 함수라, 라우터를 거치지 않고 직접 호출해서
// 에러 종류별 분기를 하나씩 확인한다.
function callErrorHandler(err: unknown): { status: number; body: unknown } {
  let status = 0;
  let body: unknown;

  const res = {
    status(code: number) {
      status = code;
      return this;
    },
    json(payload: unknown) {
      body = payload;
      return this;
    },
  } as unknown as Response;

  errorHandler(err, {} as Request, res, (() => {}) as NextFunction);

  return { status, body };
}

describe("errorHandler", () => {
  test("ZodError는 첫 번째 검증 메시지와 함께 400", () => {
    const schema = z.object({ name: z.string({ error: "이름은 필수입니다." }) });
    const parsed = schema.safeParse({});

    const { status, body } = callErrorHandler(parsed.error);

    expect(status).toBe(400);
    expect(body).toEqual({ message: "이름은 필수입니다." });
  });

  test("Prisma P2025(레코드 없음)는 404로 바꾼다", () => {
    const err = new Prisma.PrismaClientKnownRequestError("record not found", {
      code: "P2025",
      clientVersion: "6.0.0",
    });

    const { status, body } = callErrorHandler(err);

    expect(status).toBe(404);
    expect(body).toEqual({ message: "데이터를 찾을 수 없습니다." });
  });

  test("Prisma P2002(유니크 제약 위반)는 400으로 바꾼다", () => {
    const err = new Prisma.PrismaClientKnownRequestError("unique constraint", {
      code: "P2002",
      clientVersion: "6.0.0",
    });

    const { status, body } = callErrorHandler(err);

    expect(status).toBe(400);
    expect(body).toEqual({ message: "이미 존재하는 데이터입니다." });
  });

  test("처리 규칙이 없는 Prisma 에러는 500으로 떨어진다", () => {
    const err = new Prisma.PrismaClientKnownRequestError("some other failure", {
      code: "P1001",
      clientVersion: "6.0.0",
    });

    expect(callErrorHandler(err).status).toBe(500);
  });

  test("JSON 파싱 실패는 400", () => {
    const err = Object.assign(new Error("Unexpected token"), {
      type: "entity.parse.failed",
    });

    const { status, body } = callErrorHandler(err);

    expect(status).toBe(400);
    expect(body).toEqual({ message: "JSON 형식이 올바르지 않습니다." });
  });

  test("status가 붙은 에러는 그 상태 코드를 그대로 쓴다", () => {
    const err = Object.assign(new Error("파일이 너무 큽니다."), { status: 413 });

    const { status, body } = callErrorHandler(err);

    expect(status).toBe(413);
    expect(body).toEqual({ message: "파일이 너무 큽니다." });
  });

  test("정보가 없는 에러는 500과 기본 메시지", () => {
    const { status, body } = callErrorHandler({});

    expect(status).toBe(500);
    expect(body).toEqual({ message: "서버 오류가 발생했습니다." });
  });

  test("일반 Error는 500이지만 메시지는 보존된다", () => {
    const { status, body } = callErrorHandler(new Error("예상치 못한 오류"));

    expect(status).toBe(500);
    expect(body).toEqual({ message: "예상치 못한 오류" });
  });

  describe("실제 요청을 통한 확인", () => {
    test("깨진 JSON을 보내면 400을 돌려준다", async () => {
      const res = await request(app)
        .post("/auth/signin")
        .set("Content-Type", "application/json")
        .send('{"email": "a@b.com",');

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("JSON 형식이 올바르지 않습니다.");
    });

    test("컨트롤러에서 throw된 비동기 에러도 errorHandler까지 전달된다", async () => {
      // Express 5는 async 핸들러가 reject되면 자동으로 에러 미들웨어로 넘긴다.
      prismaMock.product.count.mockRejectedValue(new Error("DB 연결 실패"));

      const res = await request(app).get("/products");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("DB 연결 실패");
    });
  });
});

describe("업로드 미들웨어", () => {
  test("이미지가 아닌 파일은 거부한다", async () => {
    prismaMock.user.findUnique.mockResolvedValue(testUser);

    const res = await request(app)
      .post("/upload")
      .set("Authorization", authHeader())
      .attach("images", Buffer.from("이건 텍스트 파일"), {
        filename: "note.txt",
        contentType: "text/plain",
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("이미지 파일만 업로드할 수 있습니다.");
  });

  test("파일 없이 요청하면 400", async () => {
    prismaMock.user.findUnique.mockResolvedValue(testUser);

    const res = await request(app).post("/upload").set("Authorization", authHeader());

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("이미지 파일이 필요합니다.");
  });
});
