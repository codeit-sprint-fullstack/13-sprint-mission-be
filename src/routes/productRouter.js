import express from "express";
import passport from "#/config/passport.js";
import productController from "#/controllers/productController.js";
import { uploadImages } from "#/middlewares/upload.js";
import optionalAuth from "#/middlewares/optionalAuth.js";

const productRouter = express.Router();
const auth = passport.authenticate("access-token", { session: false });

productRouter.get("/", productController.getProducts);
productRouter.post("/", auth, productController.createProduct);

// 이미지 업로드 — /:id 보다 먼저 등록해야 충돌 방지
productRouter.post("/images", auth, uploadImages, productController.uploadImages);

productRouter.get("/:id", optionalAuth, productController.getProductById);
productRouter.patch("/:id", auth, productController.updateProduct);
productRouter.delete("/:id", auth, productController.deleteProduct);

productRouter.post("/:id/like", auth, productController.likeProduct);
productRouter.delete("/:id/like", auth, productController.unlikeProduct);

export default productRouter;
