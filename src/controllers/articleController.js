import prisma from "../config/prisma.js";
import articleService from "../services/articleService.js";

const postArticle = async (req, res) => {
  const article = await articleService.createArticle({
    ...req.body,
    userId: req.auth.id,
  });

  res.status(201).json(article);
};

const getArticles = async (req, res) => {
  const { page, pageSize, orderBy = "createdAt", keyword } = req.query;

  const article = await articleService.getArticles(
    page,
    pageSize,
    orderBy,
    keyword,
  );

  res.status(200).json(article);
};

const getArticleDetail = async (req, res) => {
  const { articleId } = req.params;

  const article = await articleService.getArticleDetail(articleId);

  res.status(200).json(article);
};

const patchArticle = async (req, res) => {
  const { articleId } = req.params;

  const article = await articleService.updateArticle(articleId, {
    ...req.body,
    userId: req.auth.id,
  });

  res.status(200).json(article);
};

const deleteArticle = async (req, res) => {
  const { articleId } = req.params;

  const article = await articleService.deleteArticle(articleId);

  res.status(200).json(article);
};

const likeArticle = async (req, res) => {
  const { articleId } = req.params;
  const { id: userId } = req.auth;
  const result = await articleService.likeArticle(articleId, userId);
  res.status(200).json(result);
};

const unlikeArticle = async (req, res) => {
  const { articleId } = req.params;
  const { id: userId } = req.auth;
  const result = await articleService.unlikeArticle(articleId, userId);
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
