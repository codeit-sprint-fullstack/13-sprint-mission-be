import express from "express";

import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/productComment.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", createComment);
router.get("/", getComments);
router.patch("/:productId", updateComment);
router.delete("/:productId", deleteComment);

export default router;
