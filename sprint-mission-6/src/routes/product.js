// routes/product.js
import { Router } from "express";
import {
  getProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../controllers/product.controller.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
import { createProductSchema } from "../schemas/product.schema.js";
import { createCommentSchema } from "../schemas/comment.schema.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

// 상품 관련 API
router.get("/", getProducts);
router.get("/:productId", getProduct);
router.post("/", validate(createProductSchema), createProduct);
router.patch("/:productId", validate(createProductSchema), updateProduct);
router.delete("/:productId", deleteProduct);

// 상품 댓글 관련 API
router.get("/:productId/comments", getComments);
router.post(
  "/:productId/comments",
  validate(createCommentSchema),
  createComment,
);
router.patch(
  "/:productId/comments/:commentId",
  validate(createCommentSchema),
  updateComment,
);
router.delete("/:productId/comments/:commentId", deleteComment);

export default router;
