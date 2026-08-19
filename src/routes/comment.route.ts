import express from "express";
import * as commentController from "../controllers/comment.controller";
import asyncHandler from "../middlewares/asyncHandler";
import { requireAuth } from "../middlewares/auth";
import { validateComment } from "../middlewares/validators";

const router = express.Router();

router
  .route("/:commentId")
  .patch(requireAuth, validateComment, asyncHandler(commentController.update))
  .delete(requireAuth, asyncHandler(commentController.remove));

export default router;
