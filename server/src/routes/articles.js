const express = require("express");

const {
  createArticle,
  listArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articlesController");

const {
  createArticleComment,
  listArticleComments,
} = require("../controllers/commentsController");

const {
  validateArticleId,
  validateCreateArticle,
  validateUpdateArticle,
  validateArticleListQuery,
} = require("../validators/articleValidators");

const {
  validateCreateComment,
  validateCommentListQuery,
} = require("../validators/commentValidators");

const router = express.Router();

router.get("/", validateArticleListQuery, listArticles);
router.post("/", validateCreateArticle, createArticle);

router.get("/:id", validateArticleId, getArticle);
router.patch("/:id", validateArticleId, validateUpdateArticle, updateArticle);
router.delete("/:id", validateArticleId, deleteArticle);

router.get(
  "/:articleId/comments",
  validateCommentListQuery,
  listArticleComments
);
router.post(
  "/:articleId/comments",
  validateCreateComment,
  createArticleComment
);

module.exports = router;
