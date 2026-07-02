import commentRepository from "../repositories/commentRepository.js";

const createComment = async (articleId, data) => {
  return commentRepository.create(articleId, data);
};

const getComments = async (articleId, cursor) => {
  return commentRepository.getAll(articleId, cursor);
};

const updateComment = async (articleId, commentId, update) => {
  return commentRepository.update(articleId, commentId, update);
};

const deleteComment = async (commentId) => {
  return commentRepository.deleteById(commentId);
};

export default {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
