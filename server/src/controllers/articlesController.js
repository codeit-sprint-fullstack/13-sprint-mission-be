const prisma = require("../utils/prisma");
const asyncHandler = require("../middlewares/asyncHandler");

const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const article = await prisma.article.create({
    data: { title, content },
  });

  res.status(201).json(article);
});

const listArticles = asyncHandler(async (req, res) => {
  const offset = req.query.offset || 0;
  const limit = req.query.limit || 10;
  const keyword = req.query.keyword || "";

  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const total = await prisma.article.count({ where });

  const articles = await prisma.article.findMany({
    where,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
  });

  res.status(200).json({
    data: articles,
    pagination: {
      total,
      offset,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

const getArticle = asyncHandler(async (req, res) => {
  const article = await prisma.article.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!article) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  res.status(200).json(article);
});

const updateArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const article = await prisma.article.update({
    where: { id: req.params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    },
  });

  res.status(200).json(article);
});

const deleteArticle = asyncHandler(async (req, res) => {
  await prisma.article.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
});

module.exports = {
  createArticle,
  listArticles,
  getArticle,
  updateArticle,
  deleteArticle,
};
