import { nanoid } from "nanoid";
import { createError } from "../../utils/httpError";
import productRepository from "./productRepository";
import productCommentRepository, {
  type ProductCommentListItem,
} from "./productCommentRepository";
import type { UpdateCommentInput } from "./productComment.Schema";
import type { CursorPaginatedResult } from "../../types/common";

interface GetCommentsParams {
  productId: string;
  cursor?: string;
  pageSize: number;
}

interface CreateCommentParams {
  productId: string;
  content: string;
  userId: string;
}

const productCommentService = {
  async getComments({
    productId,
    cursor,
    pageSize,
  }: GetCommentsParams): Promise<CursorPaginatedResult<ProductCommentListItem>> {
    const limit = Number(pageSize);
    const comments = await productCommentRepository.findMany({ productId, cursor, limit });
    const hasNext = comments.length > limit;
    const list = hasNext ? comments.slice(0, limit) : comments;
    const nextCursor = hasNext ? list[list.length - 1].id : null;
    return { list, nextCursor };
  },

  async createComment({ productId, content, userId }: CreateCommentParams) {
    const product = await productRepository.findById(productId);
    if (!product) throw createError("상품을 찾을 수 없습니다.", 404);
    return productCommentRepository.create({ id: nanoid(), content, productId, userId });
  },

  async updateComment(userId: string, id: string, data: UpdateCommentInput) {
    const comment = await productCommentRepository.findById(id);
    if (!comment) throw createError("댓글을 찾을 수 없습니다.", 404);
    if (comment.userId !== userId) throw createError("수정 권한이 없습니다.", 403);
    return productCommentRepository.update(id, data);
  },

  async deleteComment(userId: string, id: string) {
    const comment = await productCommentRepository.findById(id);
    if (!comment) throw createError("댓글을 찾을 수 없습니다.", 404);
    if (comment.userId !== userId) throw createError("삭제 권한이 없습니다.", 403);
    return productCommentRepository.delete(id);
  },
};

export default productCommentService;
