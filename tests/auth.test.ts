import request from "supertest";
import bcrypt from "bcrypt";
import app from "../src/app";
import { prismaMock } from "./setup";
import { testUser } from "./fixtures";
import { verifyToken } from "../src/utils/jwt";

const signUpBody = {
  email: "panda@test.com",
  nickname: "판다",
  password: "password123",
  passwordConfirmation: "password123",
};

describe("인증 API", () => {
  describe("POST /auth/signup — 회원가입", () => {
    test("정상 입력이면 201과 함께 사용자 정보·토큰을 돌려준다", async () => {
      // 이메일 중복 조회 → 없음
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(testUser);

      const res = await request(app).post("/auth/signup").send(signUpBody);

      expect(res.status).toBe(201);
      expect(res.body.user).toMatchObject({ email: testUser.email, nickname: testUser.nickname });
      expect(res.body.accessToken).toEqual(expect.any(String));
    });

    test("응답에 비밀번호 해시가 절대 포함되지 않는다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(testUser);

      const res = await request(app).post("/auth/signup").send(signUpBody);

      expect(res.body.user).not.toHaveProperty("encryptedPassword");
    });

    test("발급된 토큰을 검증하면 가입한 사용자의 id가 들어있다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(testUser);

      const res = await request(app).post("/auth/signup").send(signUpBody);

      expect(verifyToken(res.body.accessToken).userId).toBe(testUser.id);
    });

    test("비밀번호를 평문이 아니라 해싱해서 저장한다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(testUser);

      // Spy: 실제 bcrypt.hash를 감시해서 "무엇을 몇 번 호출했는지" 확인한다.
      const hashSpy = jest.spyOn(bcrypt, "hash");

      await request(app).post("/auth/signup").send(signUpBody);

      expect(hashSpy).toHaveBeenCalledWith(signUpBody.password, 10);

      // DB에 넘어간 값이 원래 비밀번호와 달라야 한다.
      const createArg = prismaMock.user.create.mock.calls[0][0];
      expect(createArg.data.encryptedPassword).not.toBe(signUpBody.password);

      hashSpy.mockRestore();
    });

    test("이미 가입된 이메일이면 400을 돌려주고 사용자를 만들지 않는다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(testUser);

      const res = await request(app).post("/auth/signup").send(signUpBody);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("이미 가입된 이메일입니다.");
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });

    test("비밀번호 확인이 일치하지 않으면 400", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ ...signUpBody, passwordConfirmation: "different123" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("비밀번호가 일치하지 않습니다.");
    });

    test("비밀번호가 8자 미만이면 400", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ ...signUpBody, password: "short", passwordConfirmation: "short" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("비밀번호는 8자 이상이어야 합니다.");
    });

    test("이메일 형식이 올바르지 않으면 400", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ ...signUpBody, email: "이메일아님" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("이메일 형식이 올바르지 않습니다.");
    });
  });

  describe("POST /auth/signin — 로그인", () => {
    const signInBody = { email: testUser.email, password: "password123" };

    test("이메일·비밀번호가 맞으면 200과 토큰을 돌려준다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(testUser);
      // Mock: 실제 해시 비교 대신 "맞다"고 답하도록 갈아끼운다.
      const compareSpy = jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      const res = await request(app).post("/auth/signin").send(signInBody);

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toEqual(expect.any(String));
      expect(compareSpy).toHaveBeenCalledWith(signInBody.password, testUser.encryptedPassword);

      compareSpy.mockRestore();
    });

    test("가입되지 않은 이메일이면 401", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post("/auth/signin").send(signInBody);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("이메일 또는 비밀번호가 올바르지 않습니다.");
    });

    test("비밀번호가 틀리면 401", async () => {
      prismaMock.user.findUnique.mockResolvedValue(testUser);
      const compareSpy = jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

      const res = await request(app).post("/auth/signin").send(signInBody);

      expect(res.status).toBe(401);
      compareSpy.mockRestore();
    });

    test("없는 이메일과 틀린 비밀번호의 응답 메시지가 같다 (계정 존재 여부를 노출하지 않음)", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const notFound = await request(app).post("/auth/signin").send(signInBody);

      prismaMock.user.findUnique.mockResolvedValue(testUser);
      const compareSpy = jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);
      const wrongPassword = await request(app).post("/auth/signin").send(signInBody);

      expect(notFound.body.message).toBe(wrongPassword.body.message);
      compareSpy.mockRestore();
    });
  });
});
