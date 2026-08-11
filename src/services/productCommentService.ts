import productRepository from "../repositories/productRepository";
import productCommentRepository from "../repositories/productCommentRepository";
import createError from "../utils/createError";

import type { Product, ProductComment } from "@prisma/client";
import type {
  ProductCommentRequestType,
  ProductCommentReturnType,
} from "../types/productComment";

const createComment = async (
  productId: Product["id"],
  data: ProductCommentRequestType,
): Promise<ProductCommentReturnType> => {
  const article = await productRepository.findById(productId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");
  const { content } = data;
  if (!content) throw createError(400, "content는 필수 값입니다.");

  return productCommentRepository.create(productId, data);
};

const getComments = async (
  productId: Product["id"],
  cursor?: number,
): Promise<ProductCommentReturnType[]> => {
  const article = await productRepository.findById(productId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");

  return productCommentRepository.findAll(productId, cursor);
};

const updateComment = async (
  productId: Product["id"],
  productCommentId: ProductComment["id"],
  update: ProductCommentRequestType,
): Promise<ProductCommentReturnType> => {
  const article = await productRepository.findById(productId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");
  const comment = await productCommentRepository.findById(productCommentId);
  if (!comment || comment.productId !== Number(productId))
    throw createError(404, "댓글을 찾을 수 없습니다.");
  const { content } = update;
  if (!content) throw createError(400, "content는 필수 값입니다.");

  return productCommentRepository.update(productId, productCommentId, update);
};

const deleteComment = async (
  productId: Product["id"],
  productCommentId: ProductComment["id"],
): Promise<ProductCommentReturnType> => {
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
