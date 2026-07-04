import express from "express";
import auth from "../middleware/auth.js";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(productController.getProducts)
  .post(auth.verifyAccessToken(), productController.postProduct);

productRouter
  .route("/:productId")
  .get(productController.getProductDetail)
  .patch(
    auth.verifyAccessToken(),
    auth.verifyProductAuth,
    productController.patchProduct,
  )
  .delete(
    auth.verifyAccessToken(),
    auth.verifyProductAuth,
    productController.deleteProduct,
  );

export default productRouter;
