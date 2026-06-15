// routes/article.js
import { Router } from "express";
import {
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticles,
} from "../controllers/article.controller.js";
import {
  createArticleComment,
  updateArticleComment,
  deleteArticleComment,
  getArticleComments,
} from "../controllers/comment.controller.js";
import { createArticleSchema } from "../schemas/article.schema.js";
import {
  createArticleCommentSchema,
  updateArticleCommentSchema,
} from "../schemas/comment.schema.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

// 게시물 관련 API
router.get("/", getArticles);
router.get("/:articleId", getArticle);
router.post("/", validate(createArticleSchema), createArticle);
router.patch("/:articleId", validate(createArticleSchema), updateArticle);
router.delete("/:articleId", deleteArticle);

// 게시물 댓글 관련 API
router.get("/:articleId/comments", getArticleComments);
router.post(
  "/:articleId/comments",
  validate(createArticleCommentSchema),
  createArticleComment,
);
router.patch(
  "/:articleId/comments/:commentId",
  validate(updateArticleCommentSchema),
  updateArticleComment,
);
router.delete("/:articleId/comments/:commentId", deleteArticleComment);

export default router;
