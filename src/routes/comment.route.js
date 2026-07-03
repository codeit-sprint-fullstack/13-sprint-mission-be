const express = require("express");
const commentController = require("../controllers/comment.controller");
const asyncHandler = require("../middlewares/asyncHandler");
const { requireAuth } = require("../middlewares/auth");
const { validateComment } = require("../middlewares/validators");

const router = express.Router();

router
  .route("/:commentId")
  .patch(requireAuth, validateComment, asyncHandler(commentController.update))
  .delete(requireAuth, asyncHandler(commentController.remove));

module.exports = router;
