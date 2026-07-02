import express from "express";
import productController from "../controllers/productController.js";

const productRouter = express.Router();
productRouter.post("/", productController.postProduct);
productRouter.get("/", productController.getProduct);
productRouter.get("/:productId", productController.getProductDetail);
productRouter.patch("/:productId", productController.patchProduct);
productRouter.delete("/:productId", productController.deleteProduct);

export default productRouter;
