import express from "express";
import cors from "cors";
import ProductRoutes from "./routes/ProductRoutes.js";
import ArticleRoutes from "./routes/ArticleRoutes.js";
import ArticleCommentRoutes from "./routes/ArticleCommentRoutes.js";
import ProductCommentRoutes from "./routes/ProductCommentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", ProductRoutes);
app.use("/articles", ArticleRoutes);
app.use("/articles", ArticleCommentRoutes);
app.use("/products", ProductCommentRoutes);

app.get("/", (req, res) => {
  res.send("백엔드 서버 실행 중");
});

export default app;
