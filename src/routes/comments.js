const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { validateComment } = require("../middlewares/validators");
const commentService = require("../services/commentService");

const router = express.Router();

router
  .route("/:commentId")
  .patch(requireAuth, validateComment, (req, res) => {
    res.json(
      commentService.update(req.params.commentId, req.body.content, req.user),
    );
  })
  .delete(requireAuth, (req, res) => {
    res.json(commentService.remove(req.params.commentId, req.user));
  });

module.exports = router;
