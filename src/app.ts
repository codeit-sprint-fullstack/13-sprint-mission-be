// env는 dotenv 로딩까지 담당하므로 process.env를 읽는 다른 모듈보다 먼저 import되어야 한다.
import env from "./config/env";

import express from "express";
import cors from "cors";

import productsRouter from "./routes/products";
import articlesRouter from "./routes/articles";
import commentsRouter from "./routes/comments";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import uploadRouter from "./routes/upload";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// 배포 환경에서는 Nginx가 앞단에 있어서, 앱이 보는 요청은 전부 127.0.0.1발 HTTP다.
// 이 설정이 없으면 req.protocol이 항상 "http", req.ip가 항상 Nginx의 주소가 된다.
// Nginx가 넣어주는 X-Forwarded-* 헤더를 신뢰하도록 알려준다.
if (env.isProduction) {
  app.set("trust proxy", 1);
}

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());

// 로컬 개발(UPLOAD_DRIVER=local)에서만 업로드 폴더를 정적으로 열어준다.
// 배포 환경에서는 이미지가 S3에 있으므로 이 경로 자체가 필요 없다.
if (env.upload.driver === "local") {
  app.use("/uploads", express.static("uploads"));
}

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Panda Market API" });
});

// 로드밸런서·모니터링이 서버 상태를 확인할 때 쓰는 경로.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", env: env.nodeEnv });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/upload", uploadRouter);
app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/comments", commentsRouter);

app.use(errorHandler);

// 테스트(supertest)에서는 포트를 열지 않고 app 인스턴스만 필요하므로,
// listen은 server.ts로 분리한다.
export default app;
