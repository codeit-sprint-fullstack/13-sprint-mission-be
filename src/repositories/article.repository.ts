import prisma from "../config/prisma.js";

const withLikeCount = { _count: { select: { likes: true } } };

export function create({ title, content, image, userId }) {
  return prisma.article.create({
    data: {
      title,
      content,
      image,
      userId,
    },
  });
}

export function findMany({ where, orderBy, skip, take, select }) {
  return prisma.article.findMany({ where, orderBy, skip, take, select });
}

export function count({ where }) {
  return prisma.article.count({ where });
}

export function findAllWithLikeCount() {
  return prisma.article.findMany({ include: { ...withLikeCount } });
}

export function findById(id) {
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

export function findByIdSimple(id) {
  return prisma.article.findUnique({ where: { id } });
}

export function update(id, data) {
  return prisma.article.update({ where: { id }, data });
}

export function remove(id) {
  return prisma.article.delete({ where: { id } });
}

export async function likeProduct(userId, articleId) {
  const [, article] = await prisma.$transaction([
    prisma.like.create({ data: { userId, articleId } }),
    prisma.article.findUnique({
      where: { id: articleId },
      include: { ...withLikeCount },
    }),
  ]);
  return article;
}

export async function unlikeProduct(userId, articleId) {
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

export function isLikedByUser(userId, articleId) {
  return prisma.like
    .findUnique({ where: { userId_articleId: { userId, articleId } } })
    .then(Boolean);
}

export function findFavoritesByUser(userId) {
  return prisma.article.findMany({
    where: { likes: { some: { userId } } },
    orderBy: { createdAt: "desc" },
    include: { ...withLikeCount },
  });
}
