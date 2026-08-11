import type { RequestHandler } from "express";
import articleService from "../services/articleService";

const postArticle: RequestHandler = async (req, res) => {
  const article = await articleService.createArticle({
    ...req.body,
    userId: req.auth?.id,
  });

  res.status(201).json(article);
};

const getArticles: RequestHandler = async (req, res) => {
  const { page, pageSize, orderBy = "createdAt", keyword } = req.query;
  const userId = req.auth ? req.auth.id : undefined;

  const validOrderBy =
    orderBy === "favoriteCount" || orderBy === "createdAt"
      ? orderBy
      : "createdAt";

  const article = await articleService.getArticles({
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    orderBy: validOrderBy,
    keyword: typeof keyword === "string" ? keyword : undefined,
    userId,
  });

  res.status(200).json(article);
};

const getArticleDetail: RequestHandler = async (req, res) => {
  const { articleId } = req.params;
  const userId = req.auth ? req.auth.id : undefined;

  const article = await articleService.getArticleDetail(
    Number(articleId),
    userId,
  );

  res.status(200).json(article);
};

const patchArticle: RequestHandler = async (req, res) => {
  const { articleId } = req.params;

  const article = await articleService.updateArticle(Number(articleId), {
    ...req.body,
    userId: req.auth?.id,
  });

  res.status(200).json(article);
};

const deleteArticle: RequestHandler = async (req, res) => {
  const { articleId } = req.params;

  const article = await articleService.deleteArticle(Number(articleId));

  res.status(200).json(article);
};

const likeArticle: RequestHandler = async (req, res) => {
  const { articleId } = req.params;
  const { id: userId } = req.auth!;
  const result = await articleService.likeArticle(Number(articleId), userId);
  res.status(200).json(result);
};

const unlikeArticle: RequestHandler = async (req, res) => {
  const { articleId } = req.params;
  const { id: userId } = req.auth!;
  const result = await articleService.unlikeArticle(Number(articleId), userId);
  res.status(200).json(result);
};

export default {
  postArticle,
  getArticles,
  getArticleDetail,
  patchArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
};
