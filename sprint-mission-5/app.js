import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";

dotenv.config(); // .env 파일 로드 (맨 먼저!)

const app = express();
app.use(express.json());

// DB 연결
connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 실행 중!");
});
