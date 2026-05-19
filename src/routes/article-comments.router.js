import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteArticleComments,
  getArticleComments,
  postArticleComments,
  updateArticleComments,
} from "../controllers/article-comments.controller.js";

const ArticleCommentRouter = express.Router({ mergeParams: true });

ArticleCommentRouter.get("/", asyncHandler(getArticleComments));

ArticleCommentRouter.post("/", asyncHandler(postArticleComments));

ArticleCommentRouter.patch("/:id", asyncHandler(updateArticleComments));

ArticleCommentRouter.delete("/:id", asyncHandler(deleteArticleComments));

export default ArticleCommentRouter;
