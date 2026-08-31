import express from "express";
import { updateComment, deleteComment } from "../controllers/commentsController";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router
  .route("/:id")
  .patch(requireAuth, updateComment)
  .delete(requireAuth, deleteComment);

export default router;
