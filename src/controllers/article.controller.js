import prisma from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../utils/errors.js";
import {
  createArticleSchema,
  updateArticleSchema,
} from "../schemas/article.schema.js";

// create
export const createArticle = asyncHandler(async (req, res) => {
  const data = createArticleSchema.parse(req.body);
  const article = await prisma.article.create({ data });
  res.status(201).json({ success: true, data: article });
});

// Read
export const getArticles = asyncHandler(async (req, res) => {
  const { page = "1", limit = "10", search } = req.query;

  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy = {
    createdAt: "desc",
  };

  const pageNum = parseInt(page) || 1;
  const take = parseInt(limit) || 10;
  const skip = (pageNum - 1) * take;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({ where, orderBy, skip, take }),
    prisma.article.count({ where }),
  ]);

  res.json({
    success: true,
    data: articles,
    pagination: {
      page: pageNum,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  });
});

export const getArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id: parseInt(id) },
  });
  if (!article) throw new NotFoundError("게시글을 찾을 수 없습니다.");
  res.json({ success: true, data: article });
});

// update
export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = updateArticleSchema.parse(req.body);
  const article = await prisma.article.update({
    where: { id: parseInt(id) },
    data,
  });
  res.json({ success: true, data: article });
});

// delete
export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.article.delete({
    where: { id: parseInt(id) },
  });
  res.json({ success: true, message: "게시글이 삭제되었습니다" });
});
