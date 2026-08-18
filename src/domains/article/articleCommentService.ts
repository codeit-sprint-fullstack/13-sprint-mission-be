import { nanoid } from "nanoid";
import { createError } from "../../utils/httpError";
import articleRepository from "./articleRepository";
import articleCommentRepository, {
  type ArticleCommentListItem,
} from "./articleCommentRepository";
import type { UpdateCommentInput } from "./articleComment.Schema";
import type { CursorPaginatedResult } from "../../types/common";

interface GetCommentsParams {
  articleId: string;
  cursor?: string;
  pageSize: number;
}

interface CreateCommentParams {
  articleId: string;
  content: string;
  userId: string;
}

const articleCommentService = {
  async getComments({
    articleId,
    cursor,
    pageSize,
  }: GetCommentsParams): Promise<CursorPaginatedResult<ArticleCommentListItem>> {
    const limit = Number(pageSize);
    const comments = await articleCommentRepository.findMany({ articleId, cursor, limit });
    const hasNext = comments.length > limit;
    const list = hasNext ? comments.slice(0, limit) : comments;
    const nextCursor = hasNext ? list[list.length - 1].id : null;
    return { list, nextCursor };
  },

  async createComment({ articleId, content, userId }: CreateCommentParams) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw createError("게시글을 찾을 수 없습니다.", 404);
    return articleCommentRepository.create({ id: nanoid(), content, articleId, userId });
  },

  async updateComment(userId: string, id: string, data: UpdateCommentInput) {
    const comment = await articleCommentRepository.findById(id);
    if (!comment) throw createError("댓글을 찾을 수 없습니다.", 404);
    if (comment.userId !== userId) throw createError("수정 권한이 없습니다.", 403);
    return articleCommentRepository.update(id, data);
  },

  async deleteComment(userId: string, id: string) {
    const comment = await articleCommentRepository.findById(id);
    if (!comment) throw createError("댓글을 찾을 수 없습니다.", 404);
    if (comment.userId !== userId) throw createError("삭제 권한이 없습니다.", 403);
    return articleCommentRepository.delete(id);
  },
};

export default articleCommentService;
