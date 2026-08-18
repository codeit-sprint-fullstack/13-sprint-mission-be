import type { Article, Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import type { CreateArticleInput, UpdateArticleInput } from "./article.Schema";

interface FindManyParams {
  orderBy: Prisma.ArticleOrderByWithRelationInput;
  skip: number;
  take: number;
}

export type ArticleListItem = Prisma.ArticleGetPayload<{
  select: {
    id: true;
    title: true;
    content: true;
    images: true;
    favoriteCount: true;
    createdAt: true;
    updatedAt: true;
    user: { select: { id: true; nickname: true; image: true } };
  };
}>;

export type ArticleDetail = Prisma.ArticleGetPayload<{
  include: {
    user: { select: { id: true; nickname: true; image: true } };
    articleLikes: { where: { userId: string }; select: { userId: true } };
  };
}>;

type CreateArticleData = CreateArticleInput & { id: string; userId: string };

const articleRepository = {
  findMany({ orderBy, skip, take }: FindManyParams): Promise<ArticleListItem[]> {
    return prisma.article.findMany({
      orderBy,
      skip,
      take,
      select: {
        id: true,
        title: true,
        content: true,
        images: true,
        favoriteCount: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, nickname: true, image: true } },
      },
    });
  },

  count(): Promise<number> {
    return prisma.article.count();
  },

  findById(id: string, userId?: string): Promise<ArticleDetail | null> {
    return prisma.article.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        articleLikes: { where: { userId: userId ?? "" }, select: { userId: true } },
      },
    });
  },

  create(data: CreateArticleData): Promise<Article> {
    return prisma.article.create({ data });
  },

  update(id: string, data: UpdateArticleInput): Promise<Article> {
    return prisma.article.update({ where: { id }, data });
  },

  delete(id: string): Promise<Article> {
    return prisma.article.delete({ where: { id } });
  },
};

export default articleRepository;
