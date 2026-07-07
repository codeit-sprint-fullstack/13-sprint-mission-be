import { nanoid } from "nanoid";
import { createError } from "#/utils/httpError.js";
import articleRepository from "#/repository/articleRepository.js";
import articleCommentRepository from "#/repository/articleCommentRepository.js";

const articleCommentService = {
  async getComments({ articleId, cursor, pageSize }) {
    const limit = Number(pageSize);
    const comments = await articleCommentRepository.findMany({ articleId, cursor, limit });

    const hasNext = comments.length > limit;
    const list = hasNext ? comments.slice(0, limit) : comments;
    const nextCursor = hasNext ? list[list.length - 1].id : null;

    return { list, nextCursor };
  },

  async createComment({ articleId, content }) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw createError("게시글을 찾을 수 없습니다.", 404);
    return articleCommentRepository.create({ id: nanoid(), content, articleId });
  },

  async updateComment(id, data) {
    return articleCommentRepository.update(id, data);
  },

  async deleteComment(id) {
    return articleCommentRepository.delete(id);
  },
};

export default articleCommentService;
