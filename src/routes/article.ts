import express from "express";
import auth from "../middlewares/auth";
import ArticleController from "../controllers/article.controller";
import CommentController from "../controllers/comment.controller";
import { validateQuery } from "../middlewares/validate";
import { getArticleListQuerySchema } from "../schemas/article.schema";
import { getCommentListQuerySchema } from "../schemas/comment.schema";

const router = express.Router();

router.get(
  "/",
  validateQuery(getArticleListQuerySchema),
  ArticleController.getArticleList,
);

router.get("/:id", auth.isLoggedIn, ArticleController.getArticleByID);

router.post("/", auth.isLoggedIn, ArticleController.postArticle);

router.patch(
  "/:id",
  auth.isLoggedIn,
  auth.isArticleOwner,
  ArticleController.patchArticle,
);

router.delete(
  "/:id",
  auth.isLoggedIn,
  auth.isArticleOwner,
  ArticleController.deleteArticle,
);

router.get(
  "/:id/comments",
  validateQuery(getCommentListQuerySchema),
  CommentController.getArticleCommentList,
);

router.post(
  "/:id/comments",
  auth.isLoggedIn,
  CommentController.postArticleComment,
);

router.post("/:id/like", auth.isLoggedIn, ArticleController.postArticleLike);

router.delete(
  "/:id/like",
  auth.isLoggedIn,
  ArticleController.deleteArticleLike,
);

export default router;
