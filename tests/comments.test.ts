import request from "supertest";
import app from "../src/app";
import { prismaMock } from "./setup";
import {
  testUser,
  testProduct,
  testArticle,
  testProductComment,
  testArticleComment,
  othersArticleComment,
  authHeader,
} from "./fixtures";

function loginAs(user = testUser): void {
  prismaMock.user.findUnique.mockResolvedValue(user);
}

describe("댓글 API", () => {
  describe("GET /products/:productId/comments — 커서 페이지네이션", () => {
    test("limit보다 적게 조회되면 nextCursor가 null이다", async () => {
      prismaMock.productComment.findMany.mockResolvedValue([testProductComment]);

      const res = await request(app).get("/products/1/comments?limit=10");

      expect(res.status).toBe(200);
      expect(res.body.list).toHaveLength(1);
      expect(res.body.nextCursor).toBeNull();
    });

    test("다음 페이지가 있으면 limit개만 돌려주고 nextCursor를 채운다", async () => {
      // 다음 페이지 존재 여부를 알기 위해 limit+1개를 조회하는 구조다.
      const comments = [
        { ...testProductComment, id: 3 },
        { ...testProductComment, id: 2 },
        { ...testProductComment, id: 1 },
      ];
      prismaMock.productComment.findMany.mockResolvedValue(comments);

      const res = await request(app).get("/products/1/comments?limit=2");

      expect(res.body.list).toHaveLength(2);
      expect(res.body.nextCursor).toBe(2);
      // limit+1개를 요청했는지 확인
      expect(prismaMock.productComment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 3 })
      );
    });

    test("cursor를 넘기면 그 지점부터 건너뛰고 조회한다", async () => {
      prismaMock.productComment.findMany.mockResolvedValue([]);

      await request(app).get("/products/1/comments?cursor=5");

      expect(prismaMock.productComment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 1, cursor: { id: 5 } })
      );
    });

    test("productId가 숫자가 아니면 400", async () => {
      const res = await request(app).get("/products/abc/comments");

      expect(res.status).toBe(400);
    });
  });

  describe("POST /products/:productId/comments — 상품 댓글 작성", () => {
    test("로그인 사용자는 201로 댓글을 남긴다", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(testProduct);
      prismaMock.productComment.create.mockResolvedValue(testProductComment);

      const res = await request(app)
        .post("/products/1/comments")
        .set("Authorization", authHeader())
        .send({ content: "이거 아직 있나요?" });

      expect(res.status).toBe(201);
      expect(res.body.content).toBe(testProductComment.content);
    });

    test("없는 상품에 댓글을 달면 404", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/products/9999/comments")
        .set("Authorization", authHeader())
        .send({ content: "댓글" });

      expect(res.status).toBe(404);
      expect(prismaMock.productComment.create).not.toHaveBeenCalled();
    });

    test("내용이 비어 있으면 400", async () => {
      loginAs();

      const res = await request(app)
        .post("/products/1/comments")
        .set("Authorization", authHeader())
        .send({ content: "   " });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("댓글 내용은 필수입니다.");
    });

    test("비로그인 작성은 401", async () => {
      const res = await request(app).post("/products/1/comments").send({ content: "댓글" });

      expect(res.status).toBe(401);
    });
  });

  describe("게시글 댓글", () => {
    test("GET /articles/:articleId/comments — 목록을 돌려준다", async () => {
      prismaMock.articleComment.findMany.mockResolvedValue([testArticleComment]);

      const res = await request(app).get("/articles/1/comments");

      expect(res.status).toBe(200);
      expect(res.body.list).toHaveLength(1);
    });

    test("POST /articles/:articleId/comments — 201로 작성한다", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(testArticle);
      prismaMock.articleComment.create.mockResolvedValue(testArticleComment);

      const res = await request(app)
        .post("/articles/1/comments")
        .set("Authorization", authHeader())
        .send({ content: "좋은 글이네요." });

      expect(res.status).toBe(201);
    });

    test("없는 게시글에 댓글을 달면 404", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/articles/9999/comments")
        .set("Authorization", authHeader())
        .send({ content: "댓글" });

      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /comments/:id — 수정 (권한 검증)", () => {
    test("작성자는 200으로 수정할 수 있다", async () => {
      loginAs();
      prismaMock.articleComment.findUnique.mockResolvedValue(testArticleComment);
      prismaMock.articleComment.update.mockResolvedValue({
        ...testArticleComment,
        content: "수정됨",
      });

      const res = await request(app)
        .patch("/comments/1")
        .set("Authorization", authHeader())
        .send({ content: "수정됨" });

      expect(res.status).toBe(200);
      expect(res.body.content).toBe("수정됨");
    });

    test("남의 댓글을 수정하면 403이고 update를 호출하지 않는다", async () => {
      loginAs();
      prismaMock.articleComment.findUnique.mockResolvedValue(othersArticleComment);

      const res = await request(app)
        .patch("/comments/2")
        .set("Authorization", authHeader())
        .send({ content: "고쳐볼까" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("수정 권한이 없습니다.");
      expect(prismaMock.articleComment.update).not.toHaveBeenCalled();
    });

    test("없는 댓글이면 404", async () => {
      loginAs();
      prismaMock.articleComment.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .patch("/comments/9999")
        .set("Authorization", authHeader())
        .send({ content: "수정" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("댓글을 찾을 수 없습니다.");
    });

    test("비로그인 수정은 401", async () => {
      const res = await request(app).patch("/comments/1").send({ content: "수정" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /comments/:id — 삭제 (권한 검증)", () => {
    test("작성자는 204로 삭제할 수 있다", async () => {
      loginAs();
      prismaMock.articleComment.findUnique.mockResolvedValue(testArticleComment);
      prismaMock.articleComment.delete.mockResolvedValue(testArticleComment);

      const res = await request(app)
        .delete("/comments/1")
        .set("Authorization", authHeader());

      expect(res.status).toBe(204);
      expect(prismaMock.articleComment.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    test("남의 댓글을 삭제하면 403이고 delete를 호출하지 않는다", async () => {
      loginAs();
      prismaMock.articleComment.findUnique.mockResolvedValue(othersArticleComment);

      const res = await request(app)
        .delete("/comments/2")
        .set("Authorization", authHeader());

      expect(res.status).toBe(403);
      expect(prismaMock.articleComment.delete).not.toHaveBeenCalled();
    });

    test("없는 댓글이면 404", async () => {
      loginAs();
      prismaMock.articleComment.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete("/comments/9999")
        .set("Authorization", authHeader());

      expect(res.status).toBe(404);
    });
  });
});

describe("GET /users/me — 내 정보", () => {
  test("로그인 상태면 200과 내 정보를 돌려준다", async () => {
    loginAs();

    const res = await request(app).get("/users/me").set("Authorization", authHeader());

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });

  test("응답에 비밀번호 해시가 포함되지 않는다", async () => {
    loginAs();

    const res = await request(app).get("/users/me").set("Authorization", authHeader());

    expect(res.body).not.toHaveProperty("encryptedPassword");
  });

  test("비로그인이면 401", async () => {
    const res = await request(app).get("/users/me");

    expect(res.status).toBe(401);
  });
});
