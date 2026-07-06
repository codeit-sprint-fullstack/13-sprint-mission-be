import productCommentService from "../services/productCommentService.js";

const postComment = async (req, res) => {
  const { productId } = req.params;

  const comment = await productCommentService.createComment(productId, {
    ...req.body,
    userId: req.auth.id,
  });

  return res.status(201).json(comment);
};

const getComments = async (req, res) => {
  const { productId } = req.params;
  const { cursor } = req.query;

  const comments = await productCommentService.getComments(productId, cursor);

  return res.status(200).json(comments);
};

const patchComment = async (req, res) => {
  const { productId, productCommentId } = req.params;

  const comment = await productCommentService.updateComment(
    productId,
    productCommentId,
    {
      ...req.body,
      userId: req.auth.id,
    },
  );

  return res.status(200).json(comment);
};

const deleteComment = async (req, res) => {
  const { productId, productCommentId } = req.params;

  const comment = await productCommentService.deleteComment(
    productId,
    productCommentId,
  );

  return res.status(200).json(comment);
};

export default {
  postComment,
  getComments,
  patchComment,
  deleteComment,
};
