import prisma from "../config/prisma.js";
import { asyncHandler } from "./asyncHandler.js";
import articleService from "../services/articleService.js";

const postArticle = asyncHandler(async (req, res) => {
  const article = await articleService.createArticle(req.body);

  res.status(201).json(article);
});

const getArticle = asyncHandler(async (req, res) => {
  const { page, pageSize, orderBy = "createdAt", keyword } = req.query;

  const article = await articleService.getArticles(
    page,
    pageSize,
    orderBy,
    keyword,
  );

  res.status(200).json(article);
});

const getArticleDetail = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const article = await articleService.getArticleDetail(articleId);

  res.status(200).json(article);
});

const patchArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const article = await articleService.updateArticle(articleId, req.body);

  res.status(200).json(article);
});

const deleteArticle = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const article = await articleService.deleteArticle(articleId);

  res.status(200).json(article);
});

export default {
  postArticle,
  getArticle,
  getArticleDetail,
  patchArticle,
  deleteArticle,
};
