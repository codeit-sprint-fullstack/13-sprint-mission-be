import express from "express";
import {
  listArticles,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
} from "../controllers/articlesController.js";
import {
  listArticleComments,
  createArticleComment,
} from "../controllers/commentsController.js";
import { requireAuth, optionalAuth } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").get(listArticles).post(requireAuth, createArticle);

router
  .route("/:id")
  .get(optionalAuth, getArticle)
  .patch(requireAuth, updateArticle)
  .delete(requireAuth, deleteArticle);

router
  .route("/:id/like")
  .post(requireAuth, likeArticle)
  .delete(requireAuth, unlikeArticle);

router
  .route("/:articleId/comments")
  .get(listArticleComments)
  .post(requireAuth, createArticleComment);

export default router;
