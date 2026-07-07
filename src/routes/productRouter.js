import express from "express";
import auth from "../middleware/auth.js";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(auth.verifyOptionalAccessToken, productController.getProducts)
  .post(auth.verifyAccessToken(), productController.postProduct);

productRouter
  .route("/:productId")
  .get(auth.verifyOptionalAccessToken, productController.getProductDetail)
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

productRouter
  .route("/:productId/likes")
  .post(auth.verifyAccessToken(), productController.likeProduct)
  .delete(auth.verifyAccessToken(), productController.unlikeProduct);

export default productRouter;
