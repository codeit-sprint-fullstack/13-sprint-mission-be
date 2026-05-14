// 모든 것이 연결되는 파일

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRouter from "./routes/products.js";

dotenv.config();

// express를 서버 객체로 만들어서 app에 할당 (app이 서버가 됨)
const app = express();

// 1. 모든 요청에 적용
app.use(cors()); // cors실행 -> 브라우더 요청 전부 허용
app.use(express.json()); // express실행 -> json 내장 메서드 사용 (json데이터 읽을 수 있는 기능)

// 2. 특정 경로의 요청에 적용
app.use("/products", productRouter);

// 포트번호
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`서버 실행 중: ${PORT}`));

// 헬스 체크
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
