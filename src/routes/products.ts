import express from "express";
import {
  listProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  favoriteProduct,
  unfavoriteProduct,
} from "../controllers/productsController";
import {
  listProductComments,
  createProductComment,
} from "../controllers/commentsController";
import { requireAuth, optionalAuth } from "../middlewares/auth";

const router = express.Router();

router.route("/").get(listProducts).post(requireAuth, createProduct);

router
  .route("/:id")
  .get(optionalAuth, getProduct)
  .patch(requireAuth, updateProduct)
  .delete(requireAuth, deleteProduct);

router
  .route("/:id/favorite")
  .post(requireAuth, favoriteProduct)
  .delete(requireAuth, unfavoriteProduct);

router
  .route("/:productId/comments")
  .get(listProductComments)
  .post(requireAuth, createProductComment);

export default router;
