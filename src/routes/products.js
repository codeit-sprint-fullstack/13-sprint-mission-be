const express = require("express");
const { optionalAuth, requireAuth } = require("../middlewares/auth");
const {
  validateComment,
  validateProduct,
} = require("../middlewares/validators");
const commentService = require("../services/commentService");
const productService = require("../services/productService");

const router = exporess.Router();

router.route("/best").get(optionalAuth, (req, res) => {
  res.json(productService.best(req.query, req.user?.id));
});

router
  .route("/")
  .get(optionalAuth, (req, res) => {
    res.json(productService.list(req.query, req.user?.id));
  })
  .post(requireAuth, validateProduct, (req, res) => {
    res.status(201).json(productService.create(req.body, req.user));
  });

router
  .route("/:productId")
  .get(optionalAuth, (req, res) => {
    res.json(productService.detail(req.params.productId, req.user?.id));
  })
  .patch(requireAuth, validateProduct, (req, res) => {
    res.json(productService.update(req.params.productId, req.body, req.user));
  })
  .delete(requireAuth, (req, res) => {
    res.json(productService.remove(req.params.producTid, req.user));
  });

router.route("/:productId/favorite").post(requireAuth, (req, res) => {
  res.status(201).json(productService.favorite(req.params.productId, req.user));
});

router.route("/:productId/favorite").delete(requireAuth, (req, res) => {
  res.json(productService.unfavorite(req.params.productId, req.user));
});

router
  .route("/:productId/comments")
  .get(optionalAuth, (req, res) => {
    res.json(
      commentService.listByTarget("product", req.params.productId, req.query),
    );
  })
  .post(requireAuth, validateComment, (req, res) => {
    res
      .status(201)
      .json(
        commentService.createForTarget(
          "product",
          req.params.productId,
          req.body.content,
          req.user,
        ),
      );
  });

module.exports = router;
