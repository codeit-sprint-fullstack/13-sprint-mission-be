import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

interface ListOptions {
  skip?: number;
  take?: number;
  orderBy?: Prisma.ArticleOrderByWithRelationInput;
  keyword?: string;
}

export type ArticleUpdateData = Omit<
  Partial<Prisma.ArticleUncheckedCreateInput>,
  "id"
> & { id: number };

async function getAll(
  userId?: number,
  { skip, take, orderBy, keyword }: ListOptions = {},
) {
  const where: Prisma.ArticleWhereInput = keyword
    ? { title: { contains: keyword, mode: "insensitive" } }
    : {};

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        likes: { where: { userId: userId ?? -1 } },
        user: { select: { id: true, nickName: true, image: true } },
      },
      orderBy,
      skip,
      take,
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, totalCount };
}

async function getById(id: number, userId?: number) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      comments: true,
      likes: { where: { userId: userId ?? -1 } },
      user: { select: { id: true, nickName: true, image: true } },
    },
  });
  return article;
}

async function save(article: Prisma.ArticleUncheckedCreateInput) {
  const createArticle = await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
      likeCount: article.likeCount,
      image: article.image,
      ownerId: article.ownerId,
    },
  });
  return createArticle;
}

async function update(article: ArticleUpdateData) {
  const updateArticle = await prisma.article.update({
    where: {
      id: article.id,
    },
    data: {
      title: article.title,
      content: article.content,
      likeCount: article.likeCount,
      image: article.image,
    },
  });
  return updateArticle;
}

async function deleteById(id: number) {
  const deleteArticle = await prisma.article.delete({
    where: {
      id,
    },
  });
  return deleteArticle;
}

export default {
  getAll,
  getById,
  save,
  update,
  deleteById,
};
