import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import itemRouter from "./src/routes/item.routes.js";
import articleRouter from "./src/routes/article.routes.js";

// 환경 변수 로드
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

// CORS 설정
app.use(
  cors({
    origin: CLIENT_URL,
  }),
);

// JSON 파싱
app.use(express.json());

// 비동기 서버 시작
async function start() {
  try {
    // 라우터 등록 (DB 연결 후)
    app.use("/items", itemRouter);
    app.use("/articles", articleRouter);

    // 서버 실행
    app.listen(PORT, () => {
      console.log(
        `🚀 서버가 http://localhost:${PORT} 에서 실행 중 (✅ ${env})`,
      );
    });
  } catch (error) {
    console.error("❌ 서버 시작 실패:", error.message);
    process.exit(1);
  }
}

start();

export default app;
