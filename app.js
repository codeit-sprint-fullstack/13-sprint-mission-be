import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import prisma from "./db.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import {
  createProductSchema,
  updateProductSchema,
} from "./validators/productValidator.js";
import {
  createArticleSchema,
  updateArticleSchema,
} from "./validators/articleValidator.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "./validators/commentValidator.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" })); //데이터 요청 5MB로 제한 (서버 부하)

const articleSelect = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
};

const commentSelect = {
  id: true,
  content: true,
  createdAt: true,
};

function getPositiveInt(value, defaultValue) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return defaultValue;
  }

  return number;
}

function getArticleId(value) {
  const articleId = Number(value);

  if (!Number.isInteger(articleId) || articleId < 1) {
    return null;
  }

  return articleId;
}

app.get("/", (req, res) => {
  res.json({ message: "서버가 정상적으로 동작 중 입니다!" });
});

// 상품 목록 전체 조회
app.get(
  "/products",
  asyncHandler(async (req, res) => {
    const page = getPositiveInt(req.query.page, 1);
    const pageSize = getPositiveInt(req.query.pageSize, 10);
    const keyword = req.query.keyword?.trim();
    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
          ],
        }
      : {};
    const orderBy =
      req.query.orderBy === "favorite"
        ? { favoriteCount: "desc" }
        : { createdAt: "desc" };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      list: products,
      totalCount,
    });
  }),
);

// 단일 상품 조회
app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    // 존재하지 않는 상품의 id 조회 시 에러 처리
    if (!product) {
      return res
        .status(404)
        .json({ message: "조회하신 상품을 찾을 수 없어요." });
    }

    res.json({
      list: [product],
      totalCount: 1,
    });
  }),
);

// 상품 등록
app.post(
  "/products",
  asyncHandler(async (req, res) => {
    const validationResult = createProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "상품 등록 실패 : 입력 값 또는 가격을 확인해주세요.",
        errors: validationResult.error.issues.map((err) => err.message),
      });
    }
    const product = await prisma.product.create({
      data: validationResult.data,
    });

    res.status(201).json(product);
  }),
);

app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const validationResult = updateProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "상품 수정 실패 : 입력 값 또는 가격을 확인해주세요.",
        errors: validationResult.error.issues.map((err) => err.message),
      });
    }

    if (Object.keys(validationResult.data).length === 0) {
      return res.status(400).json({ message: "수정할 값을 입력해주세요." });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "해당 상품을 찾을 수 없어요." });
    }

    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: validationResult.data,
    });

    res.json(product);
  }),
);

// 상품 삭제
app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "해당 상품을 찾을 수 없어요." });
    }

    const deletedProduct = await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "정상적으로 삭제 처리됐습니다!",
      data: deletedProduct,
    });
  }),
);

// 게시글 목록 조회
app.get(
  "/articles",
  asyncHandler(async (req, res) => {
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const limit = getPositiveInt(req.query.limit, 10);
    const keyword = req.query.keyword?.trim();
    const orderBy = req.query.orderBy === "recent" ? "recent" : "recent";
    const where = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { content: { contains: keyword, mode: "insensitive" } },
          ],
        }
      : {};

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: orderBy === "recent" ? { createdAt: "desc" } : undefined,
        select: articleSelect,
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      list: articles,
      totalCount,
      offset,
      limit,
    });
  }),
);

// 게시글 조회
app.get(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const articleId = getArticleId(req.params.id);

    if (!articleId) {
      return res.status(400).json({ message: "게시글 id가 올바르지 않습니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: articleSelect,
    });

    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없어요." });
    }

    res.json(article);
  }),
);

// 게시글 등록
app.post(
  "/articles",
  asyncHandler(async (req, res) => {
    const validationResult = createArticleSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "게시글 등록 실패 : 입력 값을 확인해주세요.",
        errors: validationResult.error.issues.map((err) => err.message),
      });
    }

    const article = await prisma.article.create({
      data: validationResult.data,
      select: articleSelect,
    });

    res.status(201).json(article);
  }),
);

// 게시글 수정
app.patch(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const articleId = getArticleId(req.params.id);

    if (!articleId) {
      return res.status(400).json({ message: "게시글 id가 올바르지 않습니다." });
    }

    const validationResult = updateArticleSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "게시글 수정 실패 : 입력 값을 확인해주세요.",
        errors: validationResult.error.issues.map((err) => err.message),
      });
    }

    if (Object.keys(validationResult.data).length === 0) {
      return res.status(400).json({ message: "수정할 값을 입력해주세요." });
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: validationResult.data,
      select: articleSelect,
    });

    res.json(article);
  }),
);

// 게시글 삭제
app.delete(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const articleId = getArticleId(req.params.id);

    if (!articleId) {
      return res.status(400).json({ message: "게시글 id가 올바르지 않습니다." });
    }

    const article = await prisma.article.delete({
      where: { id: articleId },
      select: articleSelect,
    });

    res.json({
      message: "게시글이 삭제되었습니다.",
      data: article,
    });
  }),
);

// 상품 댓글 등록
app.post(
  "/products/:productId/comments",
  asyncHandler(async (req, res) => {
    const validationResult = createCommentSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "댓글 등록 실패 : 입력 값을 확인해주세요.",
        errors: validationResult.error.issues.map((err) => err.message),
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: req.params.productId },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없어요." });
    }

    const comment = await prisma.comment.create({
      data: {
        content: validationResult.data.content,
        productId: req.params.productId,
      },
      select: commentSelect,
    });

    res.status(201).json(comment);
  }),
);

// 상품 댓글 목록 조회
app.get(
  "/products/:productId/comments",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: req.params.productId },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없어요." });
    }

    const limit = getPositiveInt(req.query.limit, 10);
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;
    const comments = await prisma.comment.findMany({
      where: { productId: req.params.productId },
      take: limit + 1,
      ...(Number.isInteger(cursor)
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      orderBy: { id: "desc" },
      select: commentSelect,
    });
    const hasNext = comments.length > limit;
    const list = hasNext ? comments.slice(0, limit) : comments;

    res.json({
      list,
      nextCursor: hasNext ? list[list.length - 1].id : null,
    });
  }),
);

// 게시글 댓글 등록
app.post(
  "/articles/:articleId/comments",
  asyncHandler(async (req, res) => {
    const articleId = getArticleId(req.params.articleId);

    if (!articleId) {
      return res.status(400).json({ message: "게시글 id가 올바르지 않습니다." });
    }

    const validationResult = createCommentSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "댓글 등록 실패 : 입력 값을 확인해주세요.",
        errors: validationResult.error.issues.map((err) => err.message),
      });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없어요." });
    }

    const comment = await prisma.comment.create({
      data: {
        content: validationResult.data.content,
        articleId,
      },
      select: commentSelect,
    });

    res.status(201).json(comment);
  }),
);

// 게시글 댓글 목록 조회
app.get(
  "/articles/:articleId/comments",
  asyncHandler(async (req, res) => {
    const articleId = getArticleId(req.params.articleId);

    if (!articleId) {
      return res.status(400).json({ message: "게시글 id가 올바르지 않습니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없어요." });
    }

    const limit = getPositiveInt(req.query.limit, 10);
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;
    const comments = await prisma.comment.findMany({
      where: { articleId },
      take: limit + 1,
      ...(Number.isInteger(cursor)
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      orderBy: { id: "desc" },
      select: commentSelect,
    });
    const hasNext = comments.length > limit;
    const list = hasNext ? comments.slice(0, limit) : comments;

    res.json({
      list,
      nextCursor: hasNext ? list[list.length - 1].id : null,
    });
  }),
);

// 댓글 수정
app.patch(
  "/comments/:id",
  asyncHandler(async (req, res) => {
    const commentId = Number(req.params.id);

    if (!Number.isInteger(commentId) || commentId < 1) {
      return res.status(400).json({ message: "댓글 id가 올바르지 않습니다." });
    }

    const validationResult = updateCommentSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "댓글 수정 실패 : 입력 값을 확인해주세요.",
        errors: validationResult.error.issues.map((err) => err.message),
      });
    }

    if (Object.keys(validationResult.data).length === 0) {
      return res.status(400).json({ message: "수정할 값을 입력해주세요." });
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: validationResult.data,
      select: commentSelect,
    });

    res.json(comment);
  }),
);

// 댓글 삭제
app.delete(
  "/comments/:id",
  asyncHandler(async (req, res) => {
    const commentId = Number(req.params.id);

    if (!Number.isInteger(commentId) || commentId < 1) {
      return res.status(400).json({ message: "댓글 id가 올바르지 않습니다." });
    }

    const comment = await prisma.comment.delete({
      where: { id: commentId },
      select: commentSelect,
    });

    res.json({
      message: "댓글이 삭제되었습니다.",
      data: comment,
    });
  }),
);

// 서버 헬스쳌 라우터
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버는  http://localhost:${PORT} 에서 동작 중 입니다!`);
});
