import productRepository from "../repositories/productRepository.js";
import productCommentRepository from "../repositories/productCommentRepository.js";
import createError from "../utils/createError.js";

const createComment = async (productId, data) => {
  const article = await productRepository.findById(productId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");
  const { content } = data;
  if (!content) throw createError(400, "content는 필수 값입니다.");

  return productCommentRepository.create(productId, data);
};

const getComments = async (productId, cursor) => {
  const article = await productRepository.findById(productId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");

  return productCommentRepository.findAll(productId, cursor);
};

const updateComment = async (productId, productCommentId, update) => {
  const article = await productRepository.findById(productId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");
  const comment = await productCommentRepository.findById(productCommentId);
  if (!comment || comment.productId !== Number(productId))
    throw createError(404, "댓글을 찾을 수 없습니다.");
  const { content } = update;
  if (!content) throw createError(400, "content는 필수 값입니다.");

  return productCommentRepository.update(productId, productCommentId, update);
};

const deleteComment = async (productId, productCommentId) => {
  const article = await productRepository.findById(productId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");
  const comment = await productCommentRepository.findById(productCommentId);
  if (!comment || comment.productId !== Number(productId))
    throw createError(404, "댓글을 찾을 수 없습니다.");

  return productCommentRepository.deleteById(productCommentId);
};

export default {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
