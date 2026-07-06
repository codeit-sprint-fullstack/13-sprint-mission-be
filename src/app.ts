// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Panda Market Backend Server is Running!");
});

// ----------------------------------------------------
//회원가입, 상품, 댓글 라우터
// ----------------------------------------------------

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "요청하신 API 라우트를 찾을 수 없습니다.",
  });
});

app.use(errorHandler);

export default app;
