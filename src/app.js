import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import articleRouter from "./routes/article.router.js";
import productRouter from "./routes/product.router.js";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.router.js";
import commentRouter from "./routes/comment.router.js";
import imageRouter from "./routes/image.router.js";
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
// 업로드된 이미지 정적 제공 (POST /images/upload가 반환하는 경로와 짝을 이룸)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 라우터 등록
app.use("/articles", articleRouter);
app.use("/products", productRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/comments", commentRouter);
app.use("/images", imageRouter);

// 요구사항(에러 처리): "모든 예외 상황을 처리할 수 있는 에러 핸들러 미들웨어를 구현합니다."
// -> 반드시 라우터 등록 다음, 가장 마지막에 위치해야 함
app.use(errorHandler);

export default app;
