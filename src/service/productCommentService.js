import { nanoid } from "nanoid";
import { createError } from "#/utils/httpError.js";
import productRepository from "#/repository/productRepository.js";
import productCommentRepository from "#/repository/productCommentRepository.js";

const productCommentService = {
  async getComments({ productId, cursor, pageSize }) {
    const limit = Number(pageSize);
    const comments = await productCommentRepository.findMany({ productId, cursor, limit });
    const hasNext = comments.length > limit;
    const list = hasNext ? comments.slice(0, limit) : comments;
    const nextCursor = hasNext ? list[list.length - 1].id : null;
    return { list, nextCursor };
  },

  async createComment({ productId, content, userId }) {
    const product = await productRepository.findById(productId);
    if (!product) throw createError("상품을 찾을 수 없습니다.", 404);
    return productCommentRepository.create({ id: nanoid(), content, productId, userId });
  },

  async updateComment(userId, id, data) {
    const comment = await productCommentRepository.findById(id);
    if (!comment) throw createError("댓글을 찾을 수 없습니다.", 404);
    if (comment.userId !== userId) throw createError("수정 권한이 없습니다.", 403);
    return productCommentRepository.update(id, data);
  },

  async deleteComment(userId, id) {
    const comment = await productCommentRepository.findById(id);
    if (!comment) throw createError("댓글을 찾을 수 없습니다.", 404);
    if (comment.userId !== userId) throw createError("삭제 권한이 없습니다.", 403);
    return productCommentRepository.delete(id);
  },
};

export default productCommentService;
