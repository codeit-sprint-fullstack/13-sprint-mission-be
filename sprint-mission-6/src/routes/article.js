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
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
import { createArticleSchema } from "../schemas/article.schema.js";
import { createCommentSchema } from "../schemas/comment.schema.js";
import { validate } from "../middlewares/validate.js";

const router = Router();
// 게시물 관련 API
router.get("/", getArticles);
router.get("/:articleId", getArticle);
router.post("/", validate(createArticleSchema), createArticle);
router.patch("/:articleId", validate(createArticleSchema), updateArticle);
router.delete("/:articleId", deleteArticle);

// 게시물 댓글 관련 API
router.get("/:articleId/comments", getComments);
router.post(
  "/:articleId/comments",
  validate(createCommentSchema),
  createComment,
);
router.patch(
  "/:articleId/comments/:commentId",
  validate(createCommentSchema),
  updateComment,
);
router.delete("/:articleId/comments/:commentId", deleteComment);

export default router;
