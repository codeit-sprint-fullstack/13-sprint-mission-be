import express from "express";
import {
  deleteArticle,
  getAllArticles,
  getArticle,
  postArticle,
  updateArticle,
} from "../controllers/articles.controller.js";

const ArticleRouter = express.Router();

ArticleRouter.get("/", getAllArticles);
ArticleRouter.get("/:id", getArticle);

ArticleRouter.post("/", postArticle);

ArticleRouter.patch("/:id", updateArticle);

ArticleRouter.delete("/:id", deleteArticle);

export default ArticleRouter;
