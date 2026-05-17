require("dotenv").config();

const express = require("express");
const cors = require("cors");

const productsRouter = require("./routes/products");
const articlesRouter = require("./routes/articles");
const commentsRouter = require("./routes/comments");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Panda Market API" });
});

app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/comments", commentsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버 실행 중: ${PORT}`);
});
