import express from "express";

import {
  createArticle,
  getArticle,
  getArticles,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";

const router = express.Router();

router.post("/", createArticle);
router.get("/", getArticles);
router.get("/:id", getArticle);
router.patch("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
