import articleRepository from "../repositories/articleRepository.js";
import commentRepository from "../repositories/commentRepository.js";
import createError from "../utils/createError.js";

const createComment = async (articleId, data) => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");
  const { content } = data;
  if (!content) throw createError(400, "content는 필수 값입니다.");

  return commentRepository.create(articleId, data);
};

const getComments = async (articleId, cursor) => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");

  return commentRepository.findAll(articleId, cursor);
};

const updateComment = async (articleId, commentId, update) => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");
  const comment = await commentRepository.findById(commentId);
  if (!comment || comment.articleId !== Number(articleId))
    throw createError(404, "댓글을 찾을 수 없습니다.");
  const { content } = update;
  if (!content) throw createError(400, "content는 필수 값입니다.");

  return commentRepository.update(articleId, commentId, update);
};

const deleteComment = async (articleId, commentId) => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");
  const comment = await commentRepository.findById(commentId);
  if (!comment || comment.articleId !== Number(articleId))
    throw createError(404, "댓글을 찾을 수 없습니다.");

  return commentRepository.deleteById(commentId);
};

export default {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
