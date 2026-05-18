import * as articleService from "../services/article.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createArticle = asyncHandler(async (req, res) => {
  const article = await articleService.createArticle(req.body);

  res.status(201).json(article);
});

export const getArticle = asyncHandler(async (req, res) => {
  const article = await articleService.getArticle(req.param.id);

  res.status(200).json(article);
});

export const getArticles = asyncHandler(async (req, res) => {
  const articles = await articleService.getArticles(req.query);

  res.status(200).json(articles);
});

export const updateArticle = asyncHandler(async (req, res) => {
  const article = await articleService.updateArticle(req.params.id, req.body);

  res.status(200).json(article);
});

export const deleteArticle = asyncHandler(async (req, res) => {
  await articleService.deleteArticle(req.params.id);

  res.status(204).send();
});
