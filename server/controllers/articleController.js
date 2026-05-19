const articleService = require("../services/articleService");
const articleRepository = require("../repositories/articleRepository");
const asyncHandler = require("../utils/asyncHandler");

exports.createArticle = asyncHandler(async (req, res) => {
  const savedArticle = await articleService.createArticle(req.body);

  res.status(201).json({
    message: "게시글이 성공적으로 등록되었습니다.",
    id: savedArticle.id,
  });
});

exports.getArticles = asyncHandler(async (req, res) => {
  const result = await articleService.getArticles(req.query);
  res.status(200).json(result);
});

exports.getArticleById = asyncHandler(async (req, res) => {
  const articleId = parseInt(req.params.id);
  if (isNaN(articleId)) {
    return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
  }
  const article = await articleService.getArticleById(articleId);
  res.status(200).json(article);
});

exports.updateArticle = asyncHandler(async (req, res) => {
  const articleId = parseInt(req.params.id);
  if (isNaN(articleId)) {
    return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
  }
  const updatedArticle = await articleService.updateArticle(
    articleId,
    req.body,
  );
  res.status(200).json(updatedArticle);
});

exports.deleteArticle = asyncHandler(async (req, res) => {
  const articleId = parseInt(req.params.id);
  if (isNaN(articleId)) {
    return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
  }
  await articleRepository.deleteArticle(articleId);
  res.status(204).end();
});

exports.favoriteArticle = asyncHandler(async (req, res) => {
  const articleId = parseInt(req.params.id);
  if (isNaN(articleId)) {
    return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
  }
  const updatedArticle = await articleService.favoriteArticle(articleId);
  res.status(200).json(updatedArticle);
});
