import express from "express";
import auth from "../middleware/auth.js";
import articleController from "../controllers/articleController";

const articleRouter = express.Router();

articleRouter
  .route("/")
  .get(auth.verifyOptionalAccessToken, articleController.getArticles)
  .post(auth.verifyAccessToken(), articleController.postArticle);

articleRouter
  .route("/:articleId")
  .get(auth.verifyOptionalAccessToken, articleController.getArticleDetail)
  .patch(
    auth.verifyAccessToken(),
    auth.verifyArticleAuth,
    articleController.patchArticle,
  )
  .delete(
    auth.verifyAccessToken(),
    auth.verifyArticleAuth,
    articleController.deleteArticle,
  );

articleRouter
  .route("/:articleId/likes")
  .post(auth.verifyAccessToken(), articleController.likeArticle)
  .delete(auth.verifyAccessToken(), articleController.unlikeArticle);

export default articleRouter;
