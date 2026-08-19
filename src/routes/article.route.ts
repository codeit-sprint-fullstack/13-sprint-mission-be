import express from "express";
import * as articleController from "../controllers/article.controller";
import asyncHandler from "../middlewares/asyncHandler";
import { optionalAuth, requireAuth } from "../middlewares/auth";
import { validateArticle, validateComment } from "../middlewares/validators";

const router = express.Router();

router.route("/best").get(optionalAuth, asyncHandler(articleController.best));

router
  .route("/")
  .get(optionalAuth, asyncHandler(articleController.list))
  .post(requireAuth, validateArticle, asyncHandler(articleController.create));

router
  .route("/:articleId")
  .get(optionalAuth, asyncHandler(articleController.detail))
  .patch(requireAuth, validateArticle, asyncHandler(articleController.update))
  .delete(requireAuth, asyncHandler(articleController.remove));

router
  .route("/:articleId/favorite")
  .post(requireAuth, asyncHandler(articleController.favorite))
  .delete(requireAuth, asyncHandler(articleController.unfavorite));

router
  .route("/:articleId/comments")
  .get(optionalAuth, asyncHandler(articleController.listComments))
  .post(
    requireAuth,
    validateComment,
    asyncHandler(articleController.createComment),
  );

export default router;
