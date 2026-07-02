import express from "express";
import articleController from "../controllers/articleController.js";

const articleRouter = express.Router();

articleRouter
  .route("/")
  .post(articleController.postArticle)
  .get(articleController.getArticles);

articleRouter
  .route("/:articleId")
  .get(articleController.getArticleDetail)
  .patch(articleController.patchArticle)
  .delete(articleController.deleteArticle);

export default articleRouter;
