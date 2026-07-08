import express from "express";
import passport from "#/config/passport.js";
import productController from "#/controllers/productController.js";
import { uploadImages } from "#/middlewares/upload.js";
import optionalAuth from "#/middlewares/optionalAuth.js";

const productRouter = express.Router();
const auth = passport.authenticate("access-token", { session: false });

productRouter
  .route("/")
  .get(productController.getProducts)
  .post(auth, productController.createProduct);

// 이미지 업로드 — /:id 보다 먼저 등록해야 충돌 방지
productRouter.post("/images", auth, uploadImages, productController.uploadImages);

productRouter
  .route("/:id")
  .get(optionalAuth, productController.getProductById)
  .patch(auth, productController.updateProduct)
  .delete(auth, productController.deleteProduct);

productRouter
  .route("/:id/like")
  .post(auth, productController.likeProduct)
  .delete(auth, productController.unlikeProduct);

export default productRouter;
