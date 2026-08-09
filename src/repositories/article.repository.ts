import prisma, { Prisma } from "../config/prisma.js";

const withLikeCount = { _count: { select: { likes: true } } };

interface CreateArticleParams {
  title: string;
  content: string;
  image?: string;
  userId?: number;
}

export function create({ title, content, image, userId }: CreateArticleParams) {
  return prisma.article.create({
    data: {
      title,
      content,
      image,
      userId,
    },
  });
}

interface FindManyArticlesParams {
  where?: Prisma.ArticleWhereInput;
  orderBy?: Prisma.ArticleOrderByWithRelationInput;
  skip?: number;
  take?: number;
  select?: Prisma.ArticleSelect;
}

export function findMany({ where, orderBy, skip, take, select }: FindManyArticlesParams) {
  return prisma.article.findMany({ where, orderBy, skip, take, select });
}

export function count({ where }: { where?: Prisma.ArticleWhereInput }) {
  return prisma.article.count({ where });
}

export function findAllWithLikeCount() {
  return prisma.article.findMany({ include: { ...withLikeCount } });
}

export function findById(id: number) {
  return prisma.article.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, nickname: true } } },
      },
      ...withLikeCount,
    },
  });
}

export function findByIdSimple(id: number) {
  return prisma.article.findUnique({ where: { id } });
}

export function update(id: number, data: Prisma.ArticleUpdateInput) {
  return prisma.article.update({ where: { id }, data });
}

export function remove(id: number) {
  return prisma.article.delete({ where: { id } });
}

export async function likeProduct(userId: number, articleId: number) {
  const [, article] = await prisma.$transaction([
    prisma.like.create({ data: { userId, articleId } }),
    prisma.article.findUnique({
      where: { id: articleId },
      include: { ...withLikeCount },
    }),
  ]);
  return article;
}

export async function unlikeProduct(userId: number, articleId: number) {
  const [, article] = await prisma.$transaction([
    prisma.like.delete({
      where: { userId_articleId: { userId, articleId } },
    }),
    prisma.article.findUnique({
      where: { id: articleId },
      include: { ...withLikeCount },
    }),
  ]);
  return article;
}

export function isLikedByUser(userId: number, articleId: number) {
  return prisma.like
    .findUnique({ where: { userId_articleId: { userId, articleId } } })
    .then(Boolean);
}

export function findFavoritesByUser(userId: number) {
  return prisma.article.findMany({
    where: { likes: { some: { userId } } },
    orderBy: { createdAt: "desc" },
    include: { ...withLikeCount },
  });
}
