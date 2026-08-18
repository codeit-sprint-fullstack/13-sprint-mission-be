import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { Request } from "express";
import { swaggerSpec } from "./config/swagger.js";
import errorHandler from "./middlewares/errorHandler.js";
import articleRouter from "./routes/article.router.js";
import authRouter from "./routes/auth.router.js";
import imageRouter from "./routes/image.router.js";
import productRouter from "./routes/product.router.js";
import userRouter from "./routes/user.router.js";

// 환경 변수 로드
const env = process.env.NODE_ENV || "development";

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

// 요청 로깅
const logFormat = env === "production" ? "combined" : "dev";
app.use(morgan(logFormat));

// CORS 설정
app.use(
  cors({
    origin: CLIENT_URL,
  }),
);

// JSON 파싱
app.use(express.json());

// 쿠키 파서
app.use(cookieParser());

// 헬스 체크 엔드포인트 (Render의 health check용)
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// API 명세서 (Swagger UI)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 비동기 서버 시작
async function start() {
  try {
    // 라우터 등록
    app.use("/users", userRouter);
    app.use("/auth", authRouter);
    app.use("/products", productRouter);
    app.use("/articles", articleRouter);
    app.use("/images", imageRouter);
    app.use("/download-images", express.static("uploads"));

    // 에러 핸들러 등록
    app.use(errorHandler);

    // 서버 실행
    app.listen(PORT, () => {
      console.log(
        `🚀 서버가 http://localhost:${PORT} 에서 실행 중 (✅ ${env})`,
      );
    });
  } catch (error) {
    console.error(
      "❌ 서버 시작 실패:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

start();

export default app;
