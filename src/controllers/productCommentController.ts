import productCommentService from "../services/productCommentService";

import type { RequestHandler } from "express";

const postComment: RequestHandler = async (req, res) => {
  const { productId } = req.params;

  const comment = await productCommentService.createComment(Number(productId), {
    ...req.body,
    userId: req.auth!.id,
  });

  return res.status(201).json(comment);
};

const getComments: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const { cursor } = req.query;

  const comments = await productCommentService.getComments(
    Number(productId),
    typeof cursor === "string" ? Number(cursor) : undefined,
  );

  return res.status(200).json(comments);
};

const patchComment: RequestHandler = async (req, res) => {
  const { productId, productCommentId } = req.params;

  const comment = await productCommentService.updateComment(
    Number(productId),
    Number(productCommentId),
    {
      ...req.body,
      userId: req.auth!.id,
    },
  );

  return res.status(200).json(comment);
};

const deleteComment: RequestHandler = async (req, res) => {
  const { productId, productCommentId } = req.params;

  const comment = await productCommentService.deleteComment(
    Number(productId),
    Number(productCommentId),
  );

  return res.status(200).json(comment);
};

export default {
  postComment,
  getComments,
  patchComment,
  deleteComment,
};
