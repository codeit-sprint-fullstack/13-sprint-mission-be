import express from "express";
import dotenv from "dotenv";
import {
  createArticle,
  deleteArticle,
  getArticle,
  getAllArticles,
  updateArticle,
} from "./controller/articleController.js";
import {
  createReply,
  updateReply,
  deleteReply,
  getAllReplies,
} from "./controller/replyController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Todo API Server" });
});
app.post("/article", createArticle);
app.get("/articles", getAllArticles);
app.get("/article/:id", getArticle);
app.delete("/article/:id", deleteArticle);
app.patch("/article/:id", updateArticle);

app.post("/article/:articleId/reply", createReply);
app.patch("/article/:articleId/reply/:id", updateReply);
app.delete("/article/:articleId/reply/:id", deleteReply);
app.get("/articles/:articleId/replies", getAllReplies);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
