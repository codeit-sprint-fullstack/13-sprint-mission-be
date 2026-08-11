import express from "express";

import {
  createProductComment,
  deleteProductComment,
  getAllProductComment,
  updateProductComment,
} from "../controllers/comment.controller.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const productRouter = express.Router();
///상품 등록
productRouter.post("/", createProduct);
///전체 상품 조회
productRouter.get("/", getAllProduct);
///상품 상세 조회
productRouter.get("/:id", getProduct);
///상품 수정
productRouter.patch("/:id", updateProduct);
///상품 삭제
productRouter.delete("/:id", deleteProduct);
///----------------------------------------------------------------------------///
/// 댓글 등록
productRouter.post("/:productId/comments", createProductComment);
/// 댓글 조회
productRouter.get("/:productId/comments", getAllProductComment);
/// 댓글 수정
productRouter.patch("/:productId/comments/:commentId", updateProductComment);
/// 댓글 삭제
productRouter.delete("/:productId/comments/:commentId", deleteProductComment);

export default productRouter;
