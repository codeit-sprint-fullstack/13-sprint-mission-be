import express from "express";
import dotenv from "dotenv";
import ProductRouter from "./routes/products.router.js";
import ArticleRouter from "./routes/articles.router.js";
import ProductCommentRouter from "./routes/product-comments.router.js";
import ArticleCommentRouter from "./routes/article-comments.router.js";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
app.use(express.json());
app.use("/products", ProductRouter);
app.use("/articles", ArticleRouter);
app.use("/products/:productId/comments", ProductCommentRouter);
app.use("/articles/:articleId/comments", ArticleCommentRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `[${process.env.NODE_ENV || "development"}] Server running on port ${PORT}`,
  );
});
