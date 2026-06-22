import express from "express";
import dotenv from "dotenv";
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticles,
  updateArticle,
} from "./controllers/article.controller.js";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "./controllers/comment.controller.js";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Sprint Mission 6 API Server" });
});

//Article
//조회
app.get("/articles", getArticles);

app.get("/articles/:id", getArticle);

//추가
app.post("/articles", createArticle);

//수정
app.patch("/articles/:id", updateArticle);

//삭제
app.delete("/articles/:id", deleteArticle);

//Comment
//추가
app.post("/articles/:articleId/comments", createComment);

//수정
app.patch("/comments/:commentId", updateComment);

//삭제
app.delete("/comments/:commentId", deleteComment);

//조회
app.get("/articles/:articleId/comments", getComments);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
