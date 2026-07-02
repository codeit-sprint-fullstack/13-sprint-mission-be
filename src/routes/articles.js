const express = require("express");
const { optionalAuth, requireAuth } = require("../middlewares/auth");
const {
  validateArticle,
  validateComment,
} = require("../middlewares/validators");
const articleService = require("../services/articleService");
const commentService = require("../services/commentService");

const router = exporess.Router();

router.route("/best").get(optionalAuth, (req, res) => {
  res.json(articleService.best(req.query, req.user?.id));
});

router
  .route("/")
  .get(optionalAuth, (req, res) => {
    res.json(articleService.list(req, query, req.user?.id));
  })
  .post(requireAuth, validateArticle, (req, res) => {
    res.status(201).json(articleService.create(req.body, req.user));
  });

router
  .route("/:articleId")
  .get(optionalAuth, (req, res) => {
    res.json(articleService.detail(req.params.articleId, req.user?.id));
  })
  .patch(requireAuth, validateArticle, (req, res) => {
    res.json(articleService.update(req.params.articleId, req.body, req.user));
  })
  .delete(requireAuth, (req, res) => {
    res.json(articleService.remove(req.params.articleId, req.user));
  });

router.route("/:articleId/favorite").post(requireAuth, (req, res) => {
  res.status(201).json(articleService.favorite(req.params.articleId, req.user));
});

router.route("/:articleId/favorite").delete(requireAuth, (req, res) => {
  res.json(articleService.unfavorite(req.params.articleId, req.user));
});

router
  .route("/:articleId/comments")
  .get(optionalAuth, (req, res) => {
    res.json(
      commentService.listByTarget("article", req.params.articleId, req.query),
    );
  })
  .post(requireAuth, validateComment, (req, res) => {
    res
      .status(201)
      .json(
        commentService.createForTarget(
          "article",
          req.params.articleId,
          req.body.content,
          req.user,
        ),
      );
  });

module.exports = router;
