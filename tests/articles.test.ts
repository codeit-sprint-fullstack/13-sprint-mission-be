import request from "supertest";
import app from "../src/app";
import { prismaMock } from "./setup";
import {
  testUser,
  testArticle,
  othersArticle,
  testArticleLike,
  authHeader,
} from "./fixtures";

function loginAs(user = testUser): void {
  prismaMock.user.findUnique.mockResolvedValue(user);
}

describe("게시글 API", () => {
  describe("GET /articles — 목록 조회", () => {
    test("로그인 없이도 200과 list·totalCount를 돌려준다", async () => {
      prismaMock.article.count.mockResolvedValue(1);
      prismaMock.article.findMany.mockResolvedValue([testArticle]);

      const res = await request(app).get("/articles");

      expect(res.status).toBe(200);
      expect(res.body.totalCount).toBe(1);
      expect(res.body.list).toHaveLength(1);
    });

    test("keyword를 넘기면 제목·내용을 검색한다", async () => {
      prismaMock.article.count.mockResolvedValue(0);
      prismaMock.article.findMany.mockResolvedValue([]);

      await request(app).get("/articles?keyword=판다");

      const arg = prismaMock.article.findMany.mock.calls[0][0];
      expect(arg?.where).toEqual({
        OR: [
          { title: { contains: "판다", mode: "insensitive" } },
          { content: { contains: "판다", mode: "insensitive" } },
        ],
      });
    });

    test("sort=like면 좋아요 많은 순으로 정렬한다", async () => {
      prismaMock.article.count.mockResolvedValue(0);
      prismaMock.article.findMany.mockResolvedValue([]);

      await request(app).get("/articles?sort=like");

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { likeCount: "desc" } })
      );
    });

    test("page·limit이 skip·take로 변환된다", async () => {
      prismaMock.article.count.mockResolvedValue(0);
      prismaMock.article.findMany.mockResolvedValue([]);

      await request(app).get("/articles?page=2&limit=5");

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 5, take: 5 })
      );
    });

    test("sort에 허용되지 않은 값을 넣으면 400", async () => {
      const res = await request(app).get("/articles?sort=이상한값");

      expect(res.status).toBe(400);
    });
  });

  describe("POST /articles — 등록", () => {
    const newArticle = { title: "제목", content: "내용" };

    test("로그인한 사용자는 201로 게시글을 등록한다", async () => {
      loginAs();
      prismaMock.article.create.mockResolvedValue(testArticle);

      const res = await request(app)
        .post("/articles")
        .set("Authorization", authHeader())
        .send(newArticle);

      expect(res.status).toBe(201);
      expect(res.body.article.title).toBe(testArticle.title);
    });

    test("작성자로 토큰의 사용자가 저장된다", async () => {
      loginAs();
      prismaMock.article.create.mockResolvedValue(testArticle);

      await request(app)
        .post("/articles")
        .set("Authorization", authHeader())
        .send(newArticle);

      expect(prismaMock.article.create.mock.calls[0][0].data.userId).toBe(testUser.id);
    });

    test("비로그인 등록은 401", async () => {
      const res = await request(app).post("/articles").send(newArticle);

      expect(res.status).toBe(401);
      expect(prismaMock.article.create).not.toHaveBeenCalled();
    });

    test("제목이 없으면 400", async () => {
      loginAs();

      const res = await request(app)
        .post("/articles")
        .set("Authorization", authHeader())
        .send({ content: "내용만 있음" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("제목은 필수입니다.");
    });

    test("image가 URL 형식이 아니면 400", async () => {
      loginAs();

      const res = await request(app)
        .post("/articles")
        .set("Authorization", authHeader())
        .send({ ...newArticle, image: "이미지아님" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /articles/:id — 상세 조회", () => {
    test("비로그인 조회는 200이고 isLiked가 false다", async () => {
      prismaMock.article.findUnique.mockResolvedValue(testArticle);

      const res = await request(app).get("/articles/1");

      expect(res.status).toBe(200);
      expect(res.body.isLiked).toBe(false);
    });

    test("로그인 상태에서 이미 좋아요했으면 isLiked가 true다", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(testArticle);
      prismaMock.articleLike.findUnique.mockResolvedValue(testArticleLike);

      const res = await request(app).get("/articles/1").set("Authorization", authHeader());

      expect(res.body.isLiked).toBe(true);
    });

    test("없는 게시글이면 404", async () => {
      prismaMock.article.findUnique.mockResolvedValue(null);

      const res = await request(app).get("/articles/9999");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("게시글을 찾을 수 없습니다.");
    });
  });

  describe("PATCH /articles/:id — 수정 (권한 검증)", () => {
    const patch = { title: "수정된 제목" };

    test("작성자는 200으로 수정할 수 있다", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(testArticle);
      prismaMock.article.update.mockResolvedValue({ ...testArticle, ...patch });

      const res = await request(app)
        .patch("/articles/1")
        .set("Authorization", authHeader())
        .send(patch);

      expect(res.status).toBe(200);
      expect(res.body.article.title).toBe(patch.title);
    });

    test("남의 게시글을 수정하면 403이고 update를 호출하지 않는다", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(othersArticle);

      const res = await request(app)
        .patch("/articles/2")
        .set("Authorization", authHeader())
        .send(patch);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("수정 권한이 없습니다.");
      expect(prismaMock.article.update).not.toHaveBeenCalled();
    });

    test("없는 게시글이면 404", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .patch("/articles/9999")
        .set("Authorization", authHeader())
        .send(patch);

      expect(res.status).toBe(404);
    });

    test("수정할 내용이 없으면 400", async () => {
      loginAs();

      const res = await request(app)
        .patch("/articles/1")
        .set("Authorization", authHeader())
        .send({});

      expect(res.status).toBe(400);
    });

    test("비로그인 수정은 401", async () => {
      const res = await request(app).patch("/articles/1").send(patch);

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /articles/:id — 삭제 (권한 검증)", () => {
    test("작성자는 204로 삭제할 수 있다", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(testArticle);
      prismaMock.article.delete.mockResolvedValue(testArticle);

      const res = await request(app)
        .delete("/articles/1")
        .set("Authorization", authHeader());

      expect(res.status).toBe(204);
    });

    test("남의 게시글을 삭제하면 403이고 delete를 호출하지 않는다", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(othersArticle);

      const res = await request(app)
        .delete("/articles/2")
        .set("Authorization", authHeader());

      expect(res.status).toBe(403);
      expect(prismaMock.article.delete).not.toHaveBeenCalled();
    });

    test("없는 게시글이면 404", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete("/articles/9999")
        .set("Authorization", authHeader());

      expect(res.status).toBe(404);
    });
  });

  describe("POST/DELETE /articles/:id/like — 좋아요", () => {
    test("좋아요하면 200이고 likeCount가 트랜잭션으로 함께 증가한다", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(testArticle);
      prismaMock.articleLike.findUnique.mockResolvedValue(null);
      prismaMock.$transaction.mockResolvedValue([
        testArticleLike,
        { ...testArticle, likeCount: 1 },
      ]);

      const res = await request(app)
        .post("/articles/1/like")
        .set("Authorization", authHeader());

      expect(res.status).toBe(200);
      expect(res.body.isLiked).toBe(true);
      expect(res.body.likeCount).toBe(1);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    });

    test("이미 좋아요한 게시글이면 400", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(testArticle);
      prismaMock.articleLike.findUnique.mockResolvedValue(testArticleLike);

      const res = await request(app)
        .post("/articles/1/like")
        .set("Authorization", authHeader());

      expect(res.status).toBe(400);
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    test("없는 게시글에 좋아요하면 404", async () => {
      loginAs();
      prismaMock.article.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/articles/9999/like")
        .set("Authorization", authHeader());

      expect(res.status).toBe(404);
    });

    test("좋아요를 취소하면 200이고 isLiked가 false가 된다", async () => {
      loginAs();
      prismaMock.articleLike.findUnique.mockResolvedValue(testArticleLike);
      prismaMock.$transaction.mockResolvedValue([
        testArticleLike,
        { ...testArticle, likeCount: 0 },
      ]);

      const res = await request(app)
        .delete("/articles/1/like")
        .set("Authorization", authHeader());

      expect(res.status).toBe(200);
      expect(res.body.isLiked).toBe(false);
    });

    test("좋아요하지 않은 게시글을 취소하면 400", async () => {
      loginAs();
      prismaMock.articleLike.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete("/articles/1/like")
        .set("Authorization", authHeader());

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("좋아요하지 않은 게시글입니다.");
    });
  });
});
