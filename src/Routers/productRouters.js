import express from "express";
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
export default productRouter;
