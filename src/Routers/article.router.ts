import express from "express";
import {
  createArticle,
  deleteArticle,
  getAllArticle,
  getArticle,
  updateArticle,
} from "../controllers/article.controller.js";
import {
  createArticleComment,
  deleteArticleComment,
  getAllArticleComment,
  updateArticleComment,
} from "../controllers/comment.controller.js";

const articleRouter = express.Router();
///게시글 등록
articleRouter.post("/", createArticle);
///게시글 전체 조회
articleRouter.get("/", getAllArticle);
///게시글 상세 조회
articleRouter.get("/:id", getArticle);
///게시글 수정
articleRouter.patch("/:id", updateArticle);
///게시글 삭제
articleRouter.delete("/:id", deleteArticle);
///----------------------------------------------------------------------------///
/// 댓글 등록
articleRouter.post("/:articleId/comments", createArticleComment);
/// 댓글 조회
articleRouter.get("/:articleId/comments", getAllArticleComment);
/// 댓글 수정
articleRouter.patch("/:articleId/comments/:commentId", updateArticleComment);

/// 댓글 삭제
articleRouter.delete("/:articleId/comments/:commentId", deleteArticleComment);

export default articleRouter;
