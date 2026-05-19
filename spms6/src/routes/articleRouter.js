import express from "express";
import {
  createArticle,
  createCommentInArticle,
  deleteArticle,
  deleteCommentInArticle,
  getArticleById,
  getArticles,
  getCommentsInArticle,
  updateArticle,
  updateCommentInArticle,
} from "../controllers/articleController.js";

const articleRouter = express.Router();

articleRouter.get("/:id/comments", getCommentsInArticle);
articleRouter.post("/:id/comments", createCommentInArticle);
articleRouter.patch("/:id/comments/:commentId", updateCommentInArticle);
articleRouter.delete("/:id/comments/:commentId", deleteCommentInArticle);
articleRouter.get("/", getArticles);
articleRouter.get("/:id", getArticleById);
articleRouter.post("/", createArticle);
articleRouter.patch("/:id", updateArticle);
articleRouter.delete("/:id", deleteArticle);

export default articleRouter;
