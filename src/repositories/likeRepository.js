import prisma from "../config/prisma.js";

async function getAll() {
  const likes = await prisma.like.findMany();
  return likes;
}

async function getById(id) {
  const like = await prisma.like.findUnique({
    where: { id: Number(id) },
  });
  return like;
}

async function save(like) {
  const createdLike = await prisma.like.create({
    data: {
      user: {
        connect: { id: like.userId },
      },
      ...(like.productId && {
        product: { connect: { id: Number(like.productId) } },
      }),
      ...(like.articleId && {
        article: { connect: { id: Number(like.articleId) } },
      }),
    },
  });
  return createdLike;
}

async function findByUserAndProduct(userId, productId) {
  const like = await prisma.like.findUnique({
    where: {
      userId_productId: { userId, productId: Number(productId) },
    },
  });
  return like;
}

async function findByUserAndArticle(userId, articleId) {
  const like = await prisma.like.findUnique({
    where: {
      userId_articleId: { userId, articleId: Number(articleId) },
    },
  });
  return like;
}

async function deleteByUserAndProduct(userId, productId) {
  const deletedLike = await prisma.like.delete({
    where: {
      userId_productId: { userId, productId: Number(productId) },
    },
  });
  return deletedLike;
}

async function deleteByUserAndArticle(userId, articleId) {
  const deletedLike = await prisma.like.delete({
    where: {
      userId_articleId: { userId, articleId: Number(articleId) },
    },
  });
  return deletedLike;
}

export default {
  getAll,
  getById,
  save,
  findByUserAndProduct,
  findByUserAndArticle,
  deleteByUserAndProduct,
  deleteByUserAndArticle,
};
