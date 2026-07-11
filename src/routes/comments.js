import express from "express";
import { updateComment, deleteComment } from "../controllers/commentsController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/:id")
  .patch(requireAuth, updateComment)
  .delete(requireAuth, deleteComment);

export default router;
