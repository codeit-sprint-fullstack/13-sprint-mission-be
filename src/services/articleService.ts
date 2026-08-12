import { Prisma } from "@prisma/client";
import HttpError from "../errors/HttpError.js";
import articleRepository, {
  ArticleUpdateData,
} from "../repositories/articleRepository.js";
import { ListQuery } from "../schemas/querySchema.js";

async function getAll(
  userId: number | undefined,
  { page, pageSize, limit, orderBy, keyword }: ListQuery,
) {
  const take = limit || pageSize;
  const skip = limit ? 0 : (page - 1) * take;
  const orderByClause: Prisma.ArticleOrderByWithRelationInput =
    orderBy === "like" ? { likeCount: "desc" } : { createdAt: "desc" };

  const { articles, totalCount } = await articleRepository.getAll(userId, {
    skip,
    take,
    orderBy: orderByClause,
    keyword,
  });

  const list = articles.map(({ likes, user, ...rest }) => ({
    ...rest,
    isLiked: likes.length > 0,
    writer: user
      ? { id: user.id, nickname: user.nickName, image: user.image }
      : null,
  }));

  return { list, totalCount };
}

async function getById(id: number, userId?: number) {
  const article = await articleRepository.getById(id, userId);
  if (!article) {
    throw new HttpError("게시글을 찾을 수 없습니다.", 404);
  }
  const { likes, user, ...rest } = article;
  return {
    ...rest,
    isLiked: likes.length > 0,
    writer: user
      ? { id: user.id, nickname: user.nickName, image: user.image }
      : null,
  };
}

async function create(article: Prisma.ArticleUncheckedCreateInput) {
  return articleRepository.save(article);
}

async function update(article: ArticleUpdateData) {
  return articleRepository.update(article);
}

async function deleteById(id: number) {
  return articleRepository.deleteById(id);
}

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
