import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";

dotenv.config(); // .env 파일 로드 (맨 먼저!)

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use("/products", productRoutes);

// DB 연결
connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 실행 중!");
});
