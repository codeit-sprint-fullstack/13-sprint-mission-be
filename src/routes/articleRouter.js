import express from "express";
import articleController from "../controllers/articleController.js";

const articleRouter = express.Router();
articleRouter.post("/", articleController.postArticle);
articleRouter.get("/", articleController.getArticle);
articleRouter.get("/best", articleController.getBestArticles);
articleRouter.get("/:articleId", articleController.getArticleDetail);
articleRouter.patch("/:articleId", articleController.patchArticle);
articleRouter.delete("/:articleId", articleController.deleteArticle);

export default articleRouter;
