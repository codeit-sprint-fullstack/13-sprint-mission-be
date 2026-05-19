import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import articleRouter from "./routes/article.js";
import productRouter from "./routes/product.js";

dotenv.config(); // .env 파일 로드 (맨 먼저!)

const app = express();
// 개발할 때 (모든 도메인 허용 - 개발 편의상)
app.use(cors());
// 배포할 때 (특정 도메인만 허용 - 보안상 좋음)
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173", // 개발용 프론트엔드
//       "https://sprint-mission-fe-5-xi.vercel.app", // 배포된 프론트엔드
//     ],
//   }),
// );
const PORT = process.env.PORT || 3000;
app.use(express.json());
// 라우터 등록
app.use("/articles", articleRouter);
app.use("/products", productRouter);

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
