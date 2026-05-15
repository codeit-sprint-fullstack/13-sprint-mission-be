import { asyncHandler } from "../utils/asycHandler.js";
import prisma, { Prisma } from "../lib/prisma.js";
import { success } from "zod";
import { nanoid } from "nanoid";
import { skip } from "@prisma/client/runtime/library";
import { NotFoundError } from "../utils/errors.js";
import { ar } from "@faker-js/faker";

export const createArticle = asyncHandler(async (req, res) => {
  const article = await prisma.article.create({
    data: {
      id: nanoid(),
      ...req.validatedData,
    },
  });
  res.status(201).json({ success: true, data: article });
});

// [ ] 게시글 조회 API를 만들어 주세요.
// [ ] id, title, content, createdAt를 조회합니다.

export const getArticle = asyncHandler(async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    orderBy = "recent",
    keyword = "",
  } = req.query;

  const offset = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const orderDir = orderBy === "oldest" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

  if (keyword) {
    const token = keyword.trim().replace(/\s+/g, ""); // 검색어 공백 제거
    const wsPattern = "\\s+";
    const like = `%${token}%`;

    const whereClause = Prisma.sql`(
    regexp_replace(COALESCE(title, ''), ${wsPattern}, '', 'g') ILIKE ${like}
    OR regexp_replace(COALESCE(content, ''), ${wsPattern}, '', 'g') ILIKE ${like}
  )`;

    const [list, totalCount] = await Promise.all([
      prisma.$queryRaw`
        SELECT * FROM article
        WHERE ${whereClause}
        ORDER BY "createdAt" ${orderDir}
        LIMIT ${limit} OFFSET ${offset}
      `,
      prisma.$queryRaw`
        SELECT COUNT(*)::int AS count FROM article
        WHERE ${whereClause}
      `,
    ]);

    return res.status(200).json({
      list,
      totalCount,
    });
  }

  const order =
    orderBy === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

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
