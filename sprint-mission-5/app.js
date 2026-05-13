import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import product from "./api/productApi.js";

// .env 파일 로드 (맨 먼저!)
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// console.log(process.env.MONGODB_URI);

// DB 연결
connectDB();
app.use("/products", product);

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 실행 중!");
});
