import dotenv from "dotenv";
import express from "express";
import Product from "./models/Product.js";
import cors from "cors";
import {
  DeleteProduct,
  GetProduct,
  PatchProduct,
  PostProduct,
} from "./controllers/product.controller.js";

//.env 파일 로드.
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/products", GetProduct);
app.post("/product", PostProduct);
app.patch("/product/:id", PatchProduct);
app.delete("/product/:id", DeleteProduct);

app.listen(process.env.PORT, () => {
  console.log("서버가 실행중 입니다.");
});
