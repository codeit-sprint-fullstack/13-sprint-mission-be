import express from "express";

import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/articleComment.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", createComment);
router.get("/", getComments);
router.patch("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
