import express from "express";
import passport from "#/config/passport.js";
import articleController from "#/controllers/articleController.js";
import articleCommentController from "#/controllers/articleCommentController.js";
import optionalAuth from "#/middlewares/optionalAuth.js";

const articleRouter = express.Router();
const auth = passport.authenticate("access-token", { session: false });

articleRouter
  .route("/")
  .get(articleController.getArticles)
  .post(auth, articleController.createArticle);

// 댓글 수정/삭제 — /:id 보다 먼저 등록해야 충돌 방지
articleRouter
  .route("/comments/:id")
  .patch(auth, articleCommentController.updateComment)
  .delete(auth, articleCommentController.deleteComment);

articleRouter
  .route("/:id")
  .get(optionalAuth, articleController.getArticleById)
  .patch(auth, articleController.updateArticle)
  .delete(auth, articleController.deleteArticle);

articleRouter
  .route("/:id/like")
  .post(auth, articleController.likeArticle)
  .delete(auth, articleController.unlikeArticle);

articleRouter
  .route("/:articleId/comments")
  .post(auth, articleCommentController.createComment)
  .get(articleCommentController.getComments);

export default articleRouter;
