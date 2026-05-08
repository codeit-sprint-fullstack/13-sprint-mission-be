import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsById,
  updateProduct,
} from "./controllers/productsControllers.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
///전체조회
app.get("/products", getProducts);

///id 조회
app.get("/products/:id", getProductsById);

///새로운 제품 등록
app.post("/products", createProduct);

///상품 수정
app.patch("/products/:id", updateProduct);

///상품 삭제
app.delete("/products/:id", deleteProduct);

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 실행 중!");
});
