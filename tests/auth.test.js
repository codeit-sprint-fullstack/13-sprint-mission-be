import { randomUUID } from "crypto";
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("인증 API", () => {
  const email = `test-${randomUUID()}@test.com`;
  const nickName = `tester-${randomUUID()}`;
  const password = "password1234";

  it("회원가입에 성공하면 201과 유저 정보를 반환한다", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email, nickName, encryptedpassword: password });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(email);
    expect(res.body.encryptedpassword).toBeUndefined();
  });

  it("이미 존재하는 이메일로 가입하면 409를 반환한다", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email, nickName: `${nickName}-2`, encryptedpassword: password });

    expect(res.status).toBe(409);
  });

  it("필수 값이 없으면 400을 반환한다", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: `missing-${randomUUID()}@test.com` });

    expect(res.status).toBe(400);
  });

  it("로그인에 성공하면 accessToken을 반환한다", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email, encryptedpassword: password });

    expect(res.status).toBe(200);
    expect(typeof res.body.accessToken).toBe("string");
  });

  it("비밀번호가 틀리면 401을 반환한다", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email, encryptedpassword: "wrongpassword" });

    expect(res.status).toBe(401);
  });
});
