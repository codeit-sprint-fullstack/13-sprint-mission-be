import express from "express";
import passport from "#/config/passport.js";
import articleController from "#/controllers/articleController.js";
import articleCommentController from "#/controllers/articleCommentController.js";
import optionalAuth from "#/middlewares/optionalAuth.js";

const articleRouter = express.Router();
const auth = passport.authenticate("access-token", { session: false });

articleRouter.get("/", articleController.getArticles);
articleRouter.post("/", auth, articleController.createArticle);

// 댓글 수정/삭제 — /:id 보다 먼저 등록해야 충돌 방지
articleRouter.patch("/comments/:id", auth, articleCommentController.updateComment);
articleRouter.delete("/comments/:id", auth, articleCommentController.deleteComment);

articleRouter.get("/:id", optionalAuth, articleController.getArticleById);
articleRouter.patch("/:id", auth, articleController.updateArticle);
articleRouter.delete("/:id", auth, articleController.deleteArticle);

articleRouter.post("/:id/like", auth, articleController.likeArticle);
articleRouter.delete("/:id/like", auth, articleController.unlikeArticle);

articleRouter.post("/:articleId/comments", auth, articleCommentController.createComment);
articleRouter.get("/:articleId/comments", articleCommentController.getComments);

export default articleRouter;
