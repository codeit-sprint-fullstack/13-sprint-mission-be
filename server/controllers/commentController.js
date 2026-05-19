const commentService = require("../services/commentService");
const commentRepository = require("../repositories/commentRepository");
const asyncHandler = require("../utils/asyncHandler");

exports.createComment = asyncHandler(async (req, res) => {
  const articleId = parseInt(req.params.id);
  if (isNaN(articleId)) {
    return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
  }
  const newComment = await commentService.createComment(
    articleId,
    req.body.content,
  );
  res.status(201).json(newComment);
});

exports.getComments = asyncHandler(async (req, res) => {
  const articleId = parseInt(req.params.id);
  if (isNaN(articleId)) {
    return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
  }
  const result = await commentService.getComments(articleId, req.query);
  res.status(200).json(result);
});

exports.updateComment = asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.commentId);
  if (isNaN(commentId)) {
    return res.status(400).json({ message: "유효하지 않은 댓글 ID입니다." });
  }
  const updatedComment = await commentService.updateComment(
    commentId,
    req.body.content,
  );
  res.status(200).json(updatedComment);
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.commentId);
  await commentRepository.deleteComment(commentId);
  res.status(204).end();
});
