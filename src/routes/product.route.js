const express = require("express");
const productController = require("../controllers/product.controller");
const asyncHandler = require("../middlewares/asyncHandler");
const { optionalAuth, requireAuth } = require("../middlewares/auth");
const {
  validateComment,
  validateProduct,
} = require("../middlewares/validators");

const router = express.Router();

router.route("/best").get(optionalAuth, asyncHandler(productController.best));

router
  .route("/")
  .get(optionalAuth, asyncHandler(productController.list))
  .post(requireAuth, validateProduct, asyncHandler(productController.create));

router
  .route("/:productId")
  .get(optionalAuth, asyncHandler(productController.detail))
  .patch(requireAuth, validateProduct, asyncHandler(productController.update))
  .delete(requireAuth, asyncHandler(productController.remove));

router
  .route("/:productId/favorite")
  .post(requireAuth, asyncHandler(productController.favorite));

router
  .route("/:productId/favorite")
  .delete(requireAuth, asyncHandler(productController.unfavorite));

router
  .route("/:productId/comments")
  .get(optionalAuth, asyncHandler(productController.listComments))
  .post(
    requireAuth,
    validateComment,
    asyncHandler(productController.createComment),
  );

module.exports = router;
