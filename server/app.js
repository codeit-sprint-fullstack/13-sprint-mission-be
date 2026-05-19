const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const articleRoutes = require("./routes/articleRoutes");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

console.log("포트 설정:", process.env.PORT);

const app = express();

// [미들웨어 설정]

app.use(express.json());

// [CORS 설정 추가]
app.use(cors());

// [요청 로깅 미들웨어]
// 서버로 들어오는 모든 요청을 가로채서 터미널에 출력합니다. (404 원인 파악에 매우 유용)
app.use((req, res, next) => {
  console.log(`[요청 수신] ${req.method} ${req.originalUrl}`);
  next();
});

// [라우터 연결 추가]
app.use("/api", productRoutes);
app.use("/api", articleRoutes);

// [기본 경로 설정]
app.get("/", (req, res) => {
  res.send("중고마켓 서버가 정상적으로 작동 중입니다!");
});

// [404 에러 처리 미들웨어]
// 라우터에서 처리되지 않은(없는) API 요청이 들어올 때 JSON 형태로 404 응답 반환
app.use((req, res, next) => {
  res.status(404).json({ message: "요청하신 API 경로를 찾을 수 없습니다." });
});

// [전역 에러 핸들러 미들웨어]
app.use(errorHandler);

// [서버 시작]
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  🚀 서버가 실행되었습니다!
  - 접속 주소: http://localhost:${PORT}
  `);
});
