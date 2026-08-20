import commentService from "../services/commentService.js";

import type { RequestHandler } from "express";

const postComment: RequestHandler = async (req, res) => {
  const { articleId } = req.params;

  const comment = await commentService.createComment(Number(articleId), {
    ...req.body,
    userId: req.auth!.id,
  });

  return res.status(201).json(comment);
};

const getComments: RequestHandler = async (req, res) => {
  const { articleId } = req.params;
  const { cursor } = req.query;

  const comments = await commentService.getComments(
    Number(articleId),
    cursor ? Number(cursor) : undefined,
  );

  return res.status(200).json(comments);
};

const patchComment: RequestHandler = async (req, res) => {
  const { articleId, commentId } = req.params;

  const comment = await commentService.updateComment(
    Number(articleId),
    Number(commentId),
    {
      ...req.body,
      userId: req.auth!.id,
    },
  );

  return res.status(200).json(comment);
};

const deleteComment: RequestHandler = async (req, res) => {
  const { articleId, commentId } = req.params;

  const comment = await commentService.deleteComment(
    Number(articleId),
    Number(commentId),
  );

  return res.status(200).json(comment);
};

export default {
  postComment,
  getComments,
  patchComment,
  deleteComment,
};
