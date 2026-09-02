import express from "express";
import dotenv from "dotenv";

// 로컬 모듈들보다 위에 있어야 함
// prisma.ts가 process.env.DATABASE_URL을 읽어 PrismaClient를 생성하는데,
// 이 줄이 늦게 실행되면 undefined 값으로 client가 만들어져서 나중에 env를 채워도 반영 안 됨 Prisma7부터 드라이버 어댑터 방식이 기본이되어서 이렇게 해야함
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

import userRouter from "./routes/user.router";
import { errorHandler } from "./middlewares/errorHandler";
import productRouter from "./routes/product.router";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", userRouter);
app.use("/products", productRouter);

app.use(errorHandler);

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`서버 동작 시작! 포트번호: ${port}`);
});
