import express from "express";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(productController.postProduct)
  .get(productController.getProduct);

productRouter
  .route("/:productId")
  .get(productController.getProductDetail)
  .patch(productController.patchProduct)
  .delete(productController.deleteProduct);

export default productRouter;
