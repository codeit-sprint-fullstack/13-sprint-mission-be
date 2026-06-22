import prisma from "../prisma/index.js";
import { asyncHandler } from "./asyncHandler.js";

export const postArticle = asyncHandler(async (req, res) => {
  const result = await prisma.article.create({
    data: req.body,
  });
  res.status(201).json(result);
});

export const getArticle = asyncHandler(async (req, res) => {
  const { page, pageSize, orderBy = "createdAt", keyword } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);
  const where = {};

  if (keyword) {
    where.OR = [
      { title: { contains: keyword } },
      { content: { contains: keyword } },
    ];
  }

  //데이터 조회, page와 pageSize 둘 다 있을 때만 pagination 적용
  const queryOptions = {
    where,
    orderBy: { [orderBy]: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  };
  if (page && pageSize) {
    queryOptions.skip = (Number(page) - 1) * Number(pageSize);
    queryOptions.take = Number(pageSize);
  }

  const [data, totalCount] = await Promise.all([
    prisma.article.findMany(queryOptions),
    prisma.article.count({ where }),
  ]);

  const articles = data.map(({ user, ...article }) => ({
    author: user.name,
    ...article,
  }));

  res.status(200).json({ totalCount, list: articles });
});

export const getBestArticles = asyncHandler(async (req, res) => {
  const best3 = await prisma.article.findMany({
    orderBy: { favoriteCount: "desc" },
    take: 3,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  const result = best3.map(({ user, ...article }) => ({
    ...article,
    author: user.name,
  }));
  res.status(200).json(result);
});

export const getArticleDetail = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { user, ...article } = await prisma.article.findUnique({
    where: { id: Number(articleId) },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  const comments = await prisma.comment.findMany({
    where: { articleId: Number(articleId) },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  const mappedComments = comments.map(({ user, ...comment }) => ({
    author: user.name,
    ...comment,
  }));

  const result = { ...article, author: user.name, comments: mappedComments };
  return res.status(200).json(result);
});

export const patchArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const userId = await prisma.article.findUnique({
    where: { id: Number(articleId) },
    select: {
      userId: true,
    },
  });
  const result = await prisma.article.update({
    where: { id: Number(articleId) },
    data: { ...req.body, userId: userId.userId },
  });
  res.status(200).json(result);
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const result = await prisma.article.delete({
    where: { id: Number(articleId) },
  });
  res.status(200).json(result);
});
