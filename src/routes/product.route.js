import express from "express";
import {
  postProducts,
  getProducts,
  getProductId,
  patchProductId,
  deleteProductId,
  postProductFavorite,
  deleteProductFavorite,
} from "../controllers/product.contoller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const productRouter = express.Router();

productRouter.post("/", authMiddleware, postProducts);
productRouter.get("/", getProducts);
productRouter.get("/:productId", getProductId);
productRouter.patch("/:productId", authMiddleware, patchProductId);
productRouter.delete("/:productId", authMiddleware, deleteProductId);
productRouter.post("/:productId/favorite", authMiddleware, postProductFavorite);
productRouter.delete(
  "/:productId/favorite",
  authMiddleware,
  deleteProductFavorite,
);

export default productRouter;
