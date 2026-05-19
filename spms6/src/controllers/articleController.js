//comments 테이블이 articleId,productId 둘 다 갖거나 없을 경우 생각
//다만 지금은 라우트구조상 분리되어있기때문에 zod에 추가는 안할거임

import { asyncHandler } from "../middlewares/asyncHandler.js";
import { NotFoundError } from "../middlewares/CustomError.js";
import { prisma } from "../prisma.js";
import {
  articleParamsSchema,
  createArticleBodySchema,
  getArticlesQuerySchema,
  updateArticleBodySchema,
} from "../validations/articleValidation.js";
import {
  commentBodySchema,
  getAndCreateCommentParamsSchema,
  getCommentsQuerySchema,
  updateAndDeleteCommentParamsSchema,
} from "../validations/commentValidation.js";

export const getCommentsInArticle = asyncHandler(async (req, res) => {
  const { id } = getAndCreateCommentParamsSchema.parse(req.params);
  const { cursor, limit = 10, sort } = getCommentsQuerySchema.parse(req.query);
  let orderBy;
  switch (sort) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }
  const comments = await prisma.comment.findMany({
    where: {
      articleId: id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy,
  });
  const hasNext = comments.length > limit;
  const data = comments.slice(0, limit);
  const nextCursor = hasNext ? data[data.length - 1].id : null;
  res.status(200).json({ comments: data, nextCursor });
});

export const createCommentInArticle = asyncHandler(async (req, res) => {
  const { id } = getAndCreateCommentParamsSchema.parse(req.params);
  const { content } = commentBodySchema.parse(req.body);
  const data = await prisma.comment.create({
    data: {
      content,
      articleId: id,
    },
  });
  res.status(201).json({ comment: data, message: "댓글 등록 성공" });
});

export const updateCommentInArticle = asyncHandler(async (req, res) => {
  const { id, commentId } = updateAndDeleteCommentParamsSchema.parse(
    req.params,
  );
  const { content } = commentBodySchema.parse(req.body);
  const data = await prisma.comment.update({
    where: { articleId: id, id: commentId },
    data: { content },
  });
  res.status(200).json({ comment: data, message: "댓글 수정 성공" });
});

export const deleteCommentInArticle = asyncHandler(async (req, res) => {
  const { id, commentId } = updateAndDeleteCommentParamsSchema.parse(
    req.params,
  );
  await prisma.comment.delete({
    where: { articleId: id, id: commentId },
  });
  res.status(204).send();
});

export const getArticles = asyncHandler(async (req, res) => {
  const {
    keyword,
    page = 1,
    limit = 10,
    sort,
  } = getArticlesQuerySchema.parse(req.query);

  let orderBy;
  switch (sort) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }
  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      }
    : {};

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      omit: {
        updatedAt: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy,
    }),
    prisma.article.count({
      where,
    }),
  ]);

  res.status(200).json({ articles, count: totalCount });
});

export const getArticleById = asyncHandler(async (req, res) => {
  const { id } = articleParamsSchema.parse(req.params);
  const article = await prisma.article.findUnique({
    where: { id },
    omit: { updatedAt: true },
  });
  if (!article) {
    throw new NotFoundError();
  }
  res.status(200).json({ article });
});

export const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = createArticleBodySchema.parse(req.body);
  const newArticle = await prisma.article.create({
    data: {
      title,
      content,
    },
  });
  res.status(201).json({ article: newArticle, message: "게시글 등록 성공" });
});

export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = articleParamsSchema.parse(req.params);
  const { title, content } = updateArticleBodySchema.parse(req.body);
  const data = await prisma.article.update({
    where: { id },
    data: {
      title,
      content,
    },
  });
  res.status(200).json({ article: data, message: "게시글 수정 성공" });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = articleParamsSchema.parse(req.params);
  await prisma.article.delete({
    where: { id },
  });
  res.status(204).send();
});
