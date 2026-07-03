const express = require("express");
const articleController = require("../controllers/article.controller");
const asyncHandler = require("../middlewares/asyncHandler");
const { optionalAuth, requireAuth } = require("../middlewares/auth");
const {
  validateArticle,
  validateComment,
} = require("../middlewares/validators");

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
  .post(requireAuth, asyncHandler(articleController.favorite));

router
  .route("/:articleId/comments")
  .get(optionalAuth, asyncHandler(articleController.listComments))
  .post(
    requireAuth,
    validateComment,
    asyncHandler(articleController.createComment),
  );

module.exports = router;
