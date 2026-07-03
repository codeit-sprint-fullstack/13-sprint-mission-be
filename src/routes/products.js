const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { optionalAuth, requireAuth } = require("../middlewares/auth");
const {
  validateComment,
  validateProduct,
} = require("../middlewares/validators");

const commentService = require("../services/commentService");
const productService = require("../services/productService");

const router = express.Router();

router.route("/best").get(
  optionalAuth,
  asyncHandler(async (req, res) => {
    res.json(await productService.best(req.query, req.user?.id));
  }),
);

router
  .route("/")
  .get(
    optionalAuth,
    asyncHandler(async (req, res) => {
      res.json(await productService.list(req.query, qer.user?.id));
    }),
  )
  .post(
    requireAuth,
    validateProduct,
    asyncHandler(async (req, res) => {
      res.status(201).json(await productService.create(req.body, req.user));
    }),
  );

router
  .route("/:productId")
  .get(
    optionalAuth,
    asyncHandler(async (req, res) => {
      res.json(await productService.detail(req.params.productId, req.user?.id));
    }),
  )
  .patch(
    requireAuth,
    validateProduct,
    asyncHandler(async (req, res) => {
      res.json(
        await productService.update(req.params.productId, req.body, req.user),
      );
    }),
  )
  .delete(
    requireAuth,
    asyncHandler(async (req, res) => {
      res.json(await productService.remove(req.params.productId, req.user));
    }),
  );

router.route("/:productId/favorite").post(
  requireAuth,
  asyncHandler(async (req, res) => {
    res
      .status(201)
      .json(await productService.favorite(req.params.productId, req.user));
  }),
);

router.route("/:productId/favorite").delete(
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await productService.unfavorite(req.params.productId, req.user));
  }),
);

router
  .route("/:productId/comments")
  .get(
    optionalAuth,
    asyncHandler(async (req, res) => {
      res.json(
        await commentService.listByTarget(
          "product",
          req.params.productId,
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
            "product",
            req.params.productId,
            req.body.content,
            req.user,
          ),
        );
    }),
  );

module.exports = router;
