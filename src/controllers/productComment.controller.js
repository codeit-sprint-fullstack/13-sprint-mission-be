import asyncHandler from "../utils/asyncHandler.js";
import * as commentService from "../services/productComment.service.js";

export const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(
    req.params.productId,
    req.body,
  );

  res.status(201).json(comment);
});

export const getComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getComments({
    productId: req.params.productId,
    ...req.query,
  });

  res.status(200).json(comments);
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.updateComment(
    req.params.commentId,
    req.body,
  );

  res.status(200).json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.params.commentId);

  res.status(204).send();
});
