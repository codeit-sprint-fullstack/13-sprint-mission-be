// routes/article.js
import { Router, RequestHandler } from "express";
import {
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticles,
} from "../controllers/article.controller.js";
import {
  createArticleComment,
  getArticleComments,
} from "../controllers/comment.controller.js";
import { createArticleSchema, updateArticleSchema } from "../schemas/article.schema.js";
import { createArticleCommentSchema } from "../schemas/comment.schema.js";
import { validate } from "../middlewares/validate.js";
import { verifyAccessToken } from "../middlewares/auth.js";

const router = Router();

// 게시물 관련 API
router.get("/", getArticles);
router.get("/:articleId", getArticle);
router.post("/", validate(createArticleSchema), createArticle);
router.patch("/:articleId", validate(updateArticleSchema), updateArticle);
router.delete("/:articleId", deleteArticle);

// 게시물 댓글 관련 API (생성/목록만 여기서, 수정/삭제는 /comments/:commentId 로 통합)
router.get("/:articleId/comments", getArticleComments);
router.post(
  "/:articleId/comments",
  verifyAccessToken,
  validate(createArticleCommentSchema),
  createArticleComment as RequestHandler,
);

export default router;
