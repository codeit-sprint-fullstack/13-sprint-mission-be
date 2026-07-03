import express from "express";
import * as productController from "../controllers/product.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { optionalAuth, requireAuth } from "../middlewares/auth.js";
import { validateComment, validateProduct } from "../middlewares/validators.js";

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

export default router;
