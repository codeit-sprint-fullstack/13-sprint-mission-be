import express from "express";
import {
  getArticle,
  getBestArticles,
  getArticleDetail,
  postArticle,
  patchArticle,
  deleteArticle,
} from "../controllers/index.js";

const articleRouter = express.Router();
articleRouter.post("/", postArticle);
articleRouter.get("/", getArticle);
articleRouter.get("/best", getBestArticles);
articleRouter.get("/:articleId", getArticleDetail);
articleRouter.patch("/:articleId", patchArticle);
articleRouter.delete("/:articleId", deleteArticle);

export default articleRouter;
