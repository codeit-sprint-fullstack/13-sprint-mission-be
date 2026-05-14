import dotenv from "dotenv";
import express from "express";
import { nanoid } from "nanoid";
import connectDB from "./db.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./controllers/productController.js";
import cors from "cors";

// .env 파일 로드 (반드시 다른 코드보다 먼저!)
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });
console.log(envFile);

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB 연결
connectDB();
app.get("/product", getProducts);
app.get("/product/:id", getProductById);
app.post("/product", createProduct);
app.patch("/product/:id", updateProduct);
app.delete("/product/:id", deleteProduct);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `[${process.env.NODE_ENV || "development"}] Server running on port ${PORT}`,
  );
});
