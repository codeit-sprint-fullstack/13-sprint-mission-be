import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import productRouter from "./routes/product";
import commentRouter from "./routes/comment";
import articleRouter from "./routes/article";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다.");
}

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/user/me", userRouter);

app.use("/products", productRouter);
app.use("/comments", commentRouter);
app.use("/articles", articleRouter);

app.use(errorHandler);

export default app;
