import { asyncHandler } from "../utils/asycHandler.js";
import prisma, { Prisma } from "../lib/prisma.js";
import { success } from "zod";
import { nanoid } from "nanoid";
import { skip } from "@prisma/client/runtime/library";
import { NotFoundError } from "../utils/errors.js";
import { ar } from "@faker-js/faker";
import { searchByKeyword } from "../utils/searchHandler.js";

//게시물 등록
export const createArticle = asyncHandler(async (req, res) => {
  const article = await prisma.article.create({
    data: {
      id: nanoid(),
      ...req.validatedData,
    },
  });
  res.status(201).json({ success: true, data: article });
});

//게시물 목록 조회
export const getArticle = asyncHandler(async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    orderBy = "recent",
    keyword = "",
  } = req.query;

  const offset = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const order =
    orderBy === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

  if (keyword) {
    const { list, totalCount } = await searchByKeyword({
      table: "article",
      fields: ["title", "content"],
      keyword,
      order,
      limit,
      offset,
    });

    return res.status(200).json({ list, totalCount });
  }

  const [totalCount, list] = await Promise.all([
    prisma.article.count(),
    prisma.article.findMany({
      orderBy: order,
      skip: offset,
      take: limit,
    }),
  ]);

  res.status(200).json({ list, totalCount });
});

//상품 상세 조회
export const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    select: { id: true, title: true, content: true, createdAt: true },
    where: { id },
  });

  if (!article) throw new NotFoundError("상품 아이디를 찾을 수 없습니다.");

  res.json(article);
});
