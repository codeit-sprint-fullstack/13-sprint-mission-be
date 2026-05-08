import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./db.js";
import itemRouter from "./routes/itemRoutes.js";

// 환경 변수 로드
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// CORS 설정
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

// JSON 파싱
app.use(express.json());

// MongoDB 연결
connectDB();

// 라우터 연결
app.use("/items", itemRouter);

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중이에요! 🚀`);
});

export default app;
