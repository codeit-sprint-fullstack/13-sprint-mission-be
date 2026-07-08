import express from "express";
import passport from "#/config/passport.js";
import productController from "#/controllers/productController.js";
import productCommentController from "#/controllers/productCommentController.js";
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

// 댓글 수정/삭제 — /:id 보다 먼저 등록해야 충돌 방지
productRouter
  .route("/comments/:id")
  .patch(auth, productCommentController.updateComment)
  .delete(auth, productCommentController.deleteComment);

productRouter
  .route("/:id")
  .get(optionalAuth, productController.getProductById)
  .patch(auth, productController.updateProduct)
  .delete(auth, productController.deleteProduct);

productRouter
  .route("/:id/like")
  .post(auth, productController.likeProduct)
  .delete(auth, productController.unlikeProduct);

productRouter
  .route("/:productId/comments")
  .get(productCommentController.getComments)
  .post(auth, productCommentController.createComment);

export default productRouter;
