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

// 비동기 서버 시작
async function start() {
  try {
    // MongoDB 연결 (완료까지 대기)
    await connectDB();

    // 라우터 등록 (DB 연결 후)
    app.use("/items", itemRouter);

    // 서버 실행
    app.listen(PORT, () => {
      console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중`);
    });
  } catch (error) {
    console.error("❌ 서버 시작 실패:", error.message);
    process.exit(1);
  }
}

start();

export default app;
