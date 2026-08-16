import "dotenv/config";
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

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Panda Market API" });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/upload", uploadRouter);
app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/comments", commentsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: ${PORT}`);
});
