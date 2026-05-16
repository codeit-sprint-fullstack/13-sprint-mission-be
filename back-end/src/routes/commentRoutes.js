import express from "express";
import {
  createComment,
  getComments,
} from "../controllers/commentController.js";

const router = express.Router({ mergeParams: true });

router.post("/", createComment); // POST /api/articles/:articleId/comments
router.get("/", getComments); // GET /api/articles/:articleId/comments

export default router;
