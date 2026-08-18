import { nanoid } from "nanoid";
import prisma from "../../lib/prisma";
import { createError } from "../../utils/httpError";
import { searchByKeyword } from "../../utils/searchHandler";
import articleRepository, { type ArticleListItem } from "./articleRepository";
import type {
  CreateArticleInput,
  UpdateArticleInput,
  GetArticlesQuery,
} from "./article.Schema";
import type { PaginatedResult } from "../../types/common";

const orderMap = {
  oldest: { createdAt: "asc" as const },
  favorite: { favoriteCount: "desc" as const },
  recent: { createdAt: "desc" as const },
};

interface LikeResult {
  id: string;
  favoriteCount: number;
}

const articleService = {
  async getArticles({
    page,
    pageSize,
    orderBy,
    keyword,
  }: GetArticlesQuery): Promise<PaginatedResult<ArticleListItem>> {
    const offset = (page - 1) * pageSize;
    const order = orderMap[orderBy] ?? orderMap.recent;

    if (keyword) {
      return searchByKeyword<ArticleListItem>({
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

  async getArticleById(id: string, userId?: string) {
    const article = await articleRepository.findById(id, userId);
    if (!article) throw createError("게시글을 찾을 수 없습니다.", 404);
    const { articleLikes, ...rest } = article;
    return { ...rest, isLiked: userId ? (articleLikes?.length ?? 0) > 0 : false };
  },

  async createArticle(userId: string, data: CreateArticleInput) {
    return articleRepository.create({ id: nanoid(), userId, ...data });
  },

  async updateArticle(userId: string, id: string, data: UpdateArticleInput) {
    const article = await articleRepository.findById(id);
    if (!article) throw createError("게시글을 찾을 수 없습니다.", 404);
    if (article.userId !== userId) throw createError("수정 권한이 없습니다.", 403);
    return articleRepository.update(id, data);
  },

  async deleteArticle(userId: string, id: string) {
    const article = await articleRepository.findById(id);
    if (!article) throw createError("게시글을 찾을 수 없습니다.", 404);
    if (article.userId !== userId) throw createError("삭제 권한이 없습니다.", 403);
    return articleRepository.delete(id);
  },

  async likeArticle(userId: string, articleId: string): Promise<LikeResult> {
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

  async unlikeArticle(userId: string, articleId: string): Promise<LikeResult> {
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
