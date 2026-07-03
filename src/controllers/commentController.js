import commentService from "../services/commentService.js";

const postComment = async (req, res) => {
  const { articleId } = req.params;

  const comment = await commentService.createComment(articleId, req.body);

  return res.status(201).json(comment);
};

const getComments = async (req, res) => {
  const { articleId } = req.params;
  const { cursor } = req.query;

  const comments = await commentService.getComments(articleId, cursor);

  return res.status(200).json(comments);
};

const patchComment = async (req, res) => {
  const { articleId, commentId } = req.params;

  const comment = await commentService.updateComment(
    articleId,
    commentId,
    req.body,
  );

  return res.status(200).json(comment);
};

const deleteComment = async (req, res) => {
  const { articleId, commentId } = req.params;

  const comment = await commentService.deleteComment(articleId, commentId);

  return res.status(200).json(comment);
};

export default {
  postComment,
  getComments,
  patchComment,
  deleteComment,
};
