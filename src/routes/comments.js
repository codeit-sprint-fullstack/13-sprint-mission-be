const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { requireAuth } = require("../middlewares/auth");
const { validateComment } = require("../middlewares/validators");
const commentService = require("../services/commentService");

const router = express.Router();

router
  .route("/:commentId")
  .patch(
    requireAuth,
    validateComment,
    asyncHandler(async (req, res) => {
      res.json(
        await commentService.update(
          req.params.commentId,
          req.body.content,
          req.user,
        ),
      );
    }),
  )
  .delete(
    requireAuth,
    asyncHandler(async (req, res) => {
      res.json(await commentService.remove(req.params.commentId, req.user));
    }),
  );

module.exports = router;
