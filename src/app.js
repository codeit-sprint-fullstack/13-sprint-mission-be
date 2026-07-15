import "dotenv/config";
import express from "express";
import cors from "cors";

import productsRouter from "./routes/products.js";
import articlesRouter from "./routes/articles.js";
import commentsRouter from "./routes/comments.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import uploadRouter from "./routes/upload.js";
import errorHandler from "./middlewares/errorHandler.js";

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
