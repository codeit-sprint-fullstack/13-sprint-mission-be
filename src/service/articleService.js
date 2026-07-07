import { nanoid } from "nanoid";
import prisma from "#/lib/prisma.js";
import { createError } from "#/utils/httpError.js";
import { searchByKeyword } from "#/utils/searchHandler.js";
import articleRepository from "#/repository/articleRepository.js";

const orderMap = {
  oldest: { createdAt: "asc" },
  favorite: { favoriteCount: "desc" },
  recent: { createdAt: "desc" },
};

const articleService = {
  async getArticles({ page, pageSize, orderBy, keyword }) {
    const offset = (page - 1) * pageSize;
    const order = orderMap[orderBy] ?? orderMap.recent;

    if (keyword) {
      return searchByKeyword({
        table: "articles",
        fields: ["title", "content"],
        keyword,
        order: orderBy === "oldest" ? "asc" : "desc",
        orderField: orderBy === "favorite" ? "favoriteCount" : "createdAt",
        limit: pageSize,
        offset,
      });
    }

    const [totalCount, list] = await Promise.all([
      articleRepository.count(),
      articleRepository.findMany({ orderBy: order, skip: offset, take: pageSize }),
    ]);

    return { list, totalCount };
  },

  async getArticleById(id, userId) {
    const article = await articleRepository.findById(id, userId);
    if (!article) throw createError("게시글을 찾을 수 없습니다.", 404);
    const { articleLikes, ...rest } = article;
    return { ...rest, isLiked: userId ? (articleLikes?.length ?? 0) > 0 : false };
  },

  async createArticle(userId, data) {
    return articleRepository.create({ id: nanoid(), userId, ...data });
  },

  async updateArticle(id, data) {
    return articleRepository.update(id, data);
  },

  async deleteArticle(id) {
    return articleRepository.delete(id);
  },

  async likeArticle(userId, articleId) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw createError("게시글을 찾을 수 없습니다.", 404);

    return prisma.$transaction(async (tx) => {
      await tx.articleLike.create({ data: { userId, articleId } });
      return tx.article.update({
        where: { id: articleId },
        data: { favoriteCount: { increment: 1 } },
        select: { id: true, favoriteCount: true },
      });
    });
  },

  async unlikeArticle(userId, articleId) {
    return prisma.$transaction(async (tx) => {
      await tx.articleLike.delete({
        where: { userId_articleId: { userId, articleId } },
      });
      return tx.article.update({
        where: { id: articleId },
        data: { favoriteCount: { decrement: 1 } },
        select: { id: true, favoriteCount: true },
      });
    });
  },
};

export default articleService;
