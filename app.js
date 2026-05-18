import dotenv from "dotenv";
import express from "express";
import Product from "./models/Product.js";
import cors from "cors";
import {
  DeleteProduct,
  GetProduct,
  GetProductDetail,
  PatchProduct,
  PostProduct,
} from "./controllers/product.controller.js";
import {
  DeleteArticle,
  GetArticle,
  GetArticleDetail,
  PatchArticle,
  PostArticle,
} from "./controllers/article.controller.js";
import {
  DeleteComment,
  GetArticleComment,
  GetProductComment,
  PatchComment,
  PostArticleComment,
  PostProductComment,
} from "./controllers/comment.controller.js";

//.env 파일 로드.
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//#region  products
app.get("/products", GetProduct);
app.get("/products/:id", GetProductDetail);

app.post("/products", PostProduct);

app.patch("/products/:id", PatchProduct);

app.delete("/products/:id", DeleteProduct);
//#endregion

//#region  articles
app.get("/articles", GetArticle);
app.get("/articles/:id", GetArticleDetail);

app.post("/articles", PostArticle);

app.patch("/articles/:id", PatchArticle);

app.delete("/articles/:id", DeleteArticle);
//#endregion

app.get("/products/:id/comments", GetProductComment);
app.get("/articles/:id/comments", GetArticleComment);

app.post("/products/:id/comments", PostProductComment);
app.post("/articles/:id/comments", PostArticleComment);

app.patch("/comments/:id", PatchComment);
app.delete("/comments/:id", DeleteComment);

app.listen(process.env.PORT, () => {
  console.log("서버가 실행중 입니다.");
});
