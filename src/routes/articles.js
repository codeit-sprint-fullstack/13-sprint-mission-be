const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { optionalAuth, requireAuth } = require("../middlewares/auth");
const {
  validateArticle,
  validateComment,
} = require("../middlewares/validators");
const articleService = require("../services/articleService");
const commentService = require("../services/commentService");

const router = express.Router();

router.route("/best").get(
  optionalAuth,
  asyncHandler(async (req, res) => {
    res.json(await articleService.best(req.query, req.user?.id));
  }),
);

router
  .route("/")
  .get(
    optionalAuth,
    asyncHandler(async (req, res) => {
      res.json(await articleService.list(req.query, req.user?.id));
    }),
  )
  .post(
    requireAuth,
    validateArticle,
    asyncHandler(async (req, res) => {
      res.status(201).json(await articleService.create(req.body, req.user));
    }),
  );

router
  .route("/:articleId")
  .get(
    optionalAuth,
    asyncHandler(async (req, res) => {
      res.json(await articleService.detail(req.params.articleId, req.user?.id));
    }),
  )
  .patch(
    requireAuth,
    validateArticle,
    asyncHandler(async (req, res) => {
      res.json(
        await articleService.update(req.params.articleId, req.body, req.user),
      );
    }),
  )
  .delete(
    requireAuth,
    asyncHandler(async (req, res) => {
      res.json(await articleService.remove(req.params.articleId, req.user));
    }),
  );

router.route("/:articleId/favorite").post(
  requireAuth,
  asyncHandler(async (req, res) => {
    res
      .status(201)
      .json(await articleService.favorite(req.params.articleId, req.user));
  }),
);

router.route("/:articleId/favorite").delete(
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await articleService.unfavorite(req.params.articleId, req.user));
  }),
);

router
  .route("/:articleId/comments")
  .get(
    optionalAuth,
    asyncHandler(async (req, res) => {
      res.json(
        await commentService.listByTarget(
          "article",
          req.params.articleId,
          req.query,
        ),
      );
    }),
  )
  .post(
    requireAuth,
    validateComment,
    asyncHandler(async (req, res) => {
      res
        .status(201)
        .json(
          await commentService.createForTarget(
            "article",
            req.params.articleId,
            req.body.content,
            req.user,
          ),
        );
    }),
  );

module.exports = router;
