import express from "express";
import dotenv from "dotenv";
import {
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../src/controllers/article.controller.js";
import {
  getAllArticleComments,
  createArticleComment,
  updateComment,
  deleteComment,
} from "./controllers/comment.controller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Articles API Server" });
});

//---게시글---

app.get("/articles", getAllArticles);
app.get("/articles/:id", getArticle);
app.post("/articles", createArticle);
app.patch("/articles/:id", updateArticle);
app.delete("/articles/:id", deleteArticle);

//---댓글---
app.get("/articles/:articleId/comments", getAllArticleComments);
app.post("/articles/:articleId/comments", createArticleComment);
app.patch("/comments/:id", updateComment);
app.delete("/comments/:id", deleteComment);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
