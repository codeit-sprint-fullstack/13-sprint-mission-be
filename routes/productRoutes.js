import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsById,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getProductsById); //상품상세조회
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/", getProducts); //상품전체조회 + 쿼리사용가능

export default router;
