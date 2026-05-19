import express from "express";
import {
  createCommentInProduct,
  createProduct,
  deleteCommentInProduct,
  deleteProduct,
  getCommentsInProduct,
  getProductById,
  getProducts,
  updateCommentInProduct,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/:id/comments", getCommentsInProduct);
productRouter.post("/:id/comments", createCommentInProduct);
productRouter.patch("/:id/comments/:commentId", updateCommentInProduct);
productRouter.delete("/:id/comments/:commentId", deleteCommentInProduct);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", createProduct);
productRouter.patch("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
