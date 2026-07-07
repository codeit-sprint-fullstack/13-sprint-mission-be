import { nanoid } from "nanoid";
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

  async getArticleById(id) {
    const article = await articleRepository.findById(id);
    if (!article) throw createError("게시글을 찾을 수 없습니다.", 404);
    return article;
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
};

export default articleService;
