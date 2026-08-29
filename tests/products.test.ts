import request from "supertest";
import app from "../src/app";
import { prismaMock } from "./setup";
import {
  testUser,
  otherUser,
  testProduct,
  othersProduct,
  testFavorite,
  authHeader,
} from "./fixtures";

// requireAuth/optionalAuth는 토큰을 검증한 뒤 prisma.user.findUnique로 실제 사용자를 확인한다.
// 로그인 상태를 만들려면 이 조회가 사용자를 돌려주도록 해두면 된다.
function loginAs(user = testUser): void {
  prismaMock.user.findUnique.mockResolvedValue(user);
}

describe("상품 API", () => {
  describe("GET /products — 목록 조회", () => {
    test("로그인 없이도 200과 list·totalCount를 돌려준다", async () => {
      prismaMock.product.count.mockResolvedValue(1);
      prismaMock.product.findMany.mockResolvedValue([testProduct]);

      const res = await request(app).get("/products");

      expect(res.status).toBe(200);
      expect(res.body.totalCount).toBe(1);
      expect(res.body.list).toHaveLength(1);
    });

    test("page·limit을 넘기면 그대로 skip·take로 변환해 조회한다", async () => {
      prismaMock.product.count.mockResolvedValue(30);
      prismaMock.product.findMany.mockResolvedValue([]);

      await request(app).get("/products?page=3&limit=10");

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 })
      );
    });

    test("keyword를 넘기면 이름·설명을 대소문자 구분 없이 검색한다", async () => {
      prismaMock.product.count.mockResolvedValue(0);
      prismaMock.product.findMany.mockResolvedValue([]);

      await request(app).get("/products?keyword=판다");

      const arg = prismaMock.product.findMany.mock.calls[0][0];
      expect(arg?.where).toEqual({
        OR: [
          { name: { contains: "판다", mode: "insensitive" } },
          { description: { contains: "판다", mode: "insensitive" } },
        ],
      });
    });

    test("sort=favorite이면 좋아요 많은 순으로 정렬한다", async () => {
      prismaMock.product.count.mockResolvedValue(0);
      prismaMock.product.findMany.mockResolvedValue([]);

      await request(app).get("/products?sort=favorite");

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { favoriteCount: "desc" } })
      );
    });

    test("limit이 허용 범위를 넘으면 400", async () => {
      const res = await request(app).get("/products?limit=999");

      expect(res.status).toBe(400);
      expect(prismaMock.product.findMany).not.toHaveBeenCalled();
    });
  });

  describe("POST /products — 등록", () => {
    const newProduct = {
      name: "판다 인형",
      description: "거의 새것입니다.",
      price: 15000,
      tags: ["인형"],
    };

    test("로그인한 사용자는 201로 상품을 등록할 수 있다", async () => {
      loginAs();
      prismaMock.product.create.mockResolvedValue(testProduct);

      const res = await request(app)
        .post("/products")
        .set("Authorization", authHeader())
        .send(newProduct);

      expect(res.status).toBe(201);
      expect(res.body.product).toMatchObject({ name: testProduct.name });
    });

    test("등록한 상품의 소유자로 토큰의 사용자가 저장된다", async () => {
      loginAs();
      prismaMock.product.create.mockResolvedValue(testProduct);

      await request(app)
        .post("/products")
        .set("Authorization", authHeader())
        .send(newProduct);

      const arg = prismaMock.product.create.mock.calls[0][0];
      expect(arg.data.userId).toBe(testUser.id);
    });

    test("토큰이 없으면 401이고 DB에 접근하지 않는다", async () => {
      const res = await request(app).post("/products").send(newProduct);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("로그인이 필요합니다.");
      expect(prismaMock.product.create).not.toHaveBeenCalled();
    });

    test("토큰이 위조되었으면 401", async () => {
      const res = await request(app)
        .post("/products")
        // HTTP 헤더에는 ASCII만 들어갈 수 있어서 형식만 그럴듯한 문자열을 쓴다.
        .set("Authorization", "Bearer not.a.valid.token")
        .send(newProduct);

      expect(res.status).toBe(401);
    });

    test("토큰은 유효하지만 그 사용자가 삭제되었으면 401", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/products")
        .set("Authorization", authHeader())
        .send(newProduct);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("유효하지 않은 사용자입니다.");
    });

    test("필수값(상품명)이 없으면 400", async () => {
      loginAs();

      const res = await request(app)
        .post("/products")
        .set("Authorization", authHeader())
        .send({ description: "설명", price: 1000 });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("상품명은 필수입니다.");
      expect(prismaMock.product.create).not.toHaveBeenCalled();
    });

    test("가격이 음수면 400", async () => {
      loginAs();

      const res = await request(app)
        .post("/products")
        .set("Authorization", authHeader())
        .send({ ...newProduct, price: -1 });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("가격은 0 이상이어야 합니다.");
    });

    test("이미지가 3장을 넘으면 400", async () => {
      loginAs();

      const res = await request(app)
        .post("/products")
        .set("Authorization", authHeader())
        .send({
          ...newProduct,
          images: [
            "https://example.com/1.png",
            "https://example.com/2.png",
            "https://example.com/3.png",
            "https://example.com/4.png",
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("이미지는 최대 3장까지 가능합니다.");
    });
  });

  describe("GET /products/:id — 상세 조회", () => {
    test("비로그인 조회는 200이고 isLiked가 false다", async () => {
      prismaMock.product.findUnique.mockResolvedValue(testProduct);

      const res = await request(app).get("/products/1");

      expect(res.status).toBe(200);
      expect(res.body.isLiked).toBe(false);
      // 비로그인이면 좋아요 여부를 조회할 이유가 없다.
      expect(prismaMock.favorite.findUnique).not.toHaveBeenCalled();
    });

    test("로그인 상태에서 이미 좋아요한 상품이면 isLiked가 true다", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(testProduct);
      prismaMock.favorite.findUnique.mockResolvedValue(testFavorite);

      const res = await request(app).get("/products/1").set("Authorization", authHeader());

      expect(res.status).toBe(200);
      expect(res.body.isLiked).toBe(true);
    });

    test("없는 상품이면 404", async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      const res = await request(app).get("/products/9999");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("상품을 찾을 수 없습니다.");
    });

    test("id가 숫자가 아니면 400", async () => {
      const res = await request(app).get("/products/abc");

      expect(res.status).toBe(400);
      expect(prismaMock.product.findUnique).not.toHaveBeenCalled();
    });
  });

  describe("PATCH /products/:id — 수정 (권한 검증)", () => {
    const patch = { name: "이름 변경" };

    test("소유자는 200으로 수정할 수 있다", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(testProduct);
      prismaMock.product.update.mockResolvedValue({ ...testProduct, ...patch });

      const res = await request(app)
        .patch("/products/1")
        .set("Authorization", authHeader())
        .send(patch);

      expect(res.status).toBe(200);
      expect(res.body.product.name).toBe(patch.name);
    });

    test("남의 상품을 수정하면 403이고 update를 호출하지 않는다", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(othersProduct);

      const res = await request(app)
        .patch("/products/2")
        .set("Authorization", authHeader())
        .send(patch);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("수정 권한이 없습니다.");
      expect(prismaMock.product.update).not.toHaveBeenCalled();
    });

    test("비로그인 수정 시도는 401", async () => {
      const res = await request(app).patch("/products/1").send(patch);

      expect(res.status).toBe(401);
      expect(prismaMock.product.update).not.toHaveBeenCalled();
    });

    test("없는 상품이면 404 (권한 검사보다 존재 확인이 먼저)", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .patch("/products/9999")
        .set("Authorization", authHeader())
        .send(patch);

      expect(res.status).toBe(404);
    });

    test("수정할 내용이 하나도 없으면 400", async () => {
      loginAs();

      const res = await request(app)
        .patch("/products/1")
        .set("Authorization", authHeader())
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /products/:id — 삭제 (권한 검증)", () => {
    test("소유자는 204로 삭제할 수 있다", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(testProduct);
      prismaMock.product.delete.mockResolvedValue(testProduct);

      const res = await request(app)
        .delete("/products/1")
        .set("Authorization", authHeader());

      expect(res.status).toBe(204);
      expect(prismaMock.product.delete).toHaveBeenCalledWith({ where: { id: testProduct.id } });
    });

    test("남의 상품을 삭제하면 403이고 delete를 호출하지 않는다", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(othersProduct);

      const res = await request(app)
        .delete("/products/2")
        .set("Authorization", authHeader());

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("삭제 권한이 없습니다.");
      expect(prismaMock.product.delete).not.toHaveBeenCalled();
    });

    test("다른 사용자로 로그인하면 자기 상품은 삭제된다 (권한이 사용자별로 판단됨)", async () => {
      loginAs(otherUser);
      prismaMock.product.findUnique.mockResolvedValue(othersProduct);
      prismaMock.product.delete.mockResolvedValue(othersProduct);

      const res = await request(app)
        .delete("/products/2")
        .set("Authorization", authHeader(otherUser));

      expect(res.status).toBe(204);
    });

    test("비로그인 삭제 시도는 401", async () => {
      const res = await request(app).delete("/products/1");

      expect(res.status).toBe(401);
    });

    test("없는 상품이면 404", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete("/products/9999")
        .set("Authorization", authHeader());

      expect(res.status).toBe(404);
    });
  });

  describe("POST/DELETE /products/:id/favorite — 좋아요", () => {
    test("좋아요하면 200이고 favoriteCount가 트랜잭션으로 함께 증가한다", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(testProduct);
      prismaMock.favorite.findUnique.mockResolvedValue(null);
      prismaMock.$transaction.mockResolvedValue([
        testFavorite,
        { ...testProduct, favoriteCount: 1 },
      ]);

      const res = await request(app)
        .post("/products/1/favorite")
        .set("Authorization", authHeader());

      expect(res.status).toBe(200);
      expect(res.body.isLiked).toBe(true);
      expect(res.body.favoriteCount).toBe(1);
      // 좋아요 생성과 카운트 증가는 반드시 한 트랜잭션이어야 한다.
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    });

    test("이미 좋아요한 상품에 또 요청하면 400", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(testProduct);
      prismaMock.favorite.findUnique.mockResolvedValue(testFavorite);

      const res = await request(app)
        .post("/products/1/favorite")
        .set("Authorization", authHeader());

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("이미 좋아요한 상품입니다.");
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    test("없는 상품에 좋아요하면 404", async () => {
      loginAs();
      prismaMock.product.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/products/9999/favorite")
        .set("Authorization", authHeader());

      expect(res.status).toBe(404);
    });

    test("좋아요를 취소하면 200이고 isLiked가 false가 된다", async () => {
      loginAs();
      prismaMock.favorite.findUnique.mockResolvedValue(testFavorite);
      prismaMock.$transaction.mockResolvedValue([
        testFavorite,
        { ...testProduct, favoriteCount: 0 },
      ]);

      const res = await request(app)
        .delete("/products/1/favorite")
        .set("Authorization", authHeader());

      expect(res.status).toBe(200);
      expect(res.body.isLiked).toBe(false);
    });

    test("좋아요하지 않은 상품을 취소하면 400", async () => {
      loginAs();
      prismaMock.favorite.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete("/products/1/favorite")
        .set("Authorization", authHeader());

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("좋아요하지 않은 상품입니다.");
    });

    test("비로그인 좋아요는 401", async () => {
      const res = await request(app).post("/products/1/favorite");

      expect(res.status).toBe(401);
    });
  });
});
