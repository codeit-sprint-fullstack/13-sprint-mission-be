import express from "express";
import * as commentController from "../controllers/comment.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { requireAuth } from "../middlewares/auth.js";
import { validateComment } from "../middlewares/validators.js";

const router = express.Router();

router
  .route("/:commentId")
  .patch(requireAuth, validateComment, asyncHandler(commentController.update))
  .delete(requireAuth, asyncHandler(commentController.remove));

export default router;
