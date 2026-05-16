import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";

const router = express.Router();

router.post("/", createArticle); // POST /api/articles
router.get("/", getArticles); // GET /api/articles
router.get("/:id", getArticleById); // GET /api/articles/:id
router.patch("/:id", updateArticle); // PATCH /api/articles/:id
router.delete("/:id", deleteArticle); // DELETE /api/articles/:id

export default router;
