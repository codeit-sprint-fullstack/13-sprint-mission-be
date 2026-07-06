import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import articleRouter from "./routes/article.router.js";
import productRouter from "./routes/product.router.js";
import userRouter from "./routes/user.router.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config(); // .env 파일 로드 (맨 먼저!)

const app = express();
// 개발할 때 (모든 도메인 허용 - 개발 편의상)
// app.use(cors());
// 배포할 때 (특정 도메인만 허용 - 보안상 좋음)
const corsOptions = {
  origin: ["http://localhost:3000", process.env.CLIENT_URL],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
// 라우터 등록
app.use("/articles", articleRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);

// 요구사항(에러 처리): "모든 예외 상황을 처리할 수 있는 에러 핸들러 미들웨어를 구현합니다."
// -> 반드시 라우터 등록 다음, 가장 마지막에 위치해야 함
app.use(errorHandler);

export default app;
