import prisma, { Prisma } from "../lib/prisma.js";
import { nanoid } from "nanoid";
import { NotFoundError } from "../utils/errors.js";
import { searchByKeyword } from "../utils/searchHandler.js";

// 게시물 등록
export const createArticleService = async ({ data }) => {
  const article = await prisma.article.create({
    data: {
      id: nanoid(),
      ...data,
    },
  });
  return article;
};

// 게시물 목록 조회
export const getArticleService = async ({
  page,
  pageSize,
  orderBy,
  keyword,
}) => {
  const offset = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const order =
    orderBy === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

  if (keyword) {
    return await searchByKeyword({
      table: "article",
      fields: ["title", "content"],
      keyword,
      order: orderBy === "oldest" ? "asc" : "desc", // ✅ 문자열로 전달
      limit,
      offset,
    });
  }

  const [totalCount, list] = await Promise.all([
    prisma.article.count(),
    prisma.article.findMany({
      orderBy: order,
      skip: offset,
      take: limit,
    }),
  ]);

  return { list, totalCount };
};

// 게시글 상세 조회
export const getArticleByIdService = async ({ id }) => {
  const article = await prisma.article.findUnique({
    select: { id: true, title: true, content: true, createdAt: true },
    where: { id },
  });

  if (!article) throw new NotFoundError("상품 아이디를 찾을 수 없습니다.");

  return article;
};

// 게시글 수정
export const updateArticleService = async ({ id, data }) => {
  const article = await prisma.article.update({
    where: { id },
    data,
  });

  if (!article) throw new NotFoundError("존재하지 않는 ID 입니다.");

  return article;
};

// 게시글 삭제
export const deleteArticleService = async ({ id }) => {
  const article = await prisma.article.delete({ where: { id } });

  if (!article) throw new NotFoundError("존재하지 않는 게시글 입니다.");

  return article;
};
