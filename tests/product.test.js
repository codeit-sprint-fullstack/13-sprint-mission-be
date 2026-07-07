import { randomUUID } from "crypto";
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";

async function signUpAndLogin() {
  const email = `product-${randomUUID()}@test.com`;
  const nickName = `product-${randomUUID()}`;
  const password = "password1234";

  await request(app)
    .post("/users")
    .send({ email, nickName, encryptedpassword: password });

  const loginRes = await request(app)
    .post("/login")
    .send({ email, encryptedpassword: password });

  return loginRes.body.accessToken;
}

describe("상품 API", () => {
  let accessToken;
  let productId;

  beforeAll(async () => {
    accessToken = await signUpAndLogin();
  });

  it("인증 없이 등록하면 401을 반환한다", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "상품", description: "테스트 상품 설명입니다", price: 1000 });

    expect(res.status).toBe(401);
  });

  it("유효성 검증에 실패하면 400을 반환한다", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "", description: "짧음", price: -1 });

    expect(res.status).toBe(400);
  });

  it("정상 등록하면 201과 생성된 상품을 반환한다", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "테스트 상품",
        description: "테스트 상품 설명입니다",
        price: 10000,
      });

    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe("number");
    productId = res.body.id;
  });

  it("비로그인으로 상세 조회하면 isLiked가 false이고 댓글 목록을 포함한다", async () => {
    const res = await request(app).get(`/products/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body.isLiked).toBe(false);
    expect(res.body.comments).toEqual([]);
  });

  it("좋아요 -> 중복 좋아요(409) -> 취소 -> 중복 취소(404) 흐름이 정상 동작한다", async () => {
    const likeRes = await request(app)
      .post(`/products/${productId}/favorite`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(likeRes.status).toBe(201);

    const duplicateRes = await request(app)
      .post(`/products/${productId}/favorite`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(duplicateRes.status).toBe(409);

    const detailRes = await request(app)
      .get(`/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(detailRes.body.isLiked).toBe(true);
    expect(detailRes.body.favoriteCount).toBe(1);

    const unlikeRes = await request(app)
      .delete(`/products/${productId}/favorite`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(unlikeRes.status).toBe(204);

    const duplicateUnlikeRes = await request(app)
      .delete(`/products/${productId}/favorite`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(duplicateUnlikeRes.status).toBe(404);
  });

  it("등록자가 아니면 수정/삭제 시 403을 반환한다", async () => {
    const otherToken = await signUpAndLogin();

    const res = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ name: "해킹시도" });

    expect(res.status).toBe(403);
  });
});
