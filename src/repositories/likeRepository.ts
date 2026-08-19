import prisma from "../config/prisma.js";

async function findByUserAndProduct(userId: number, productId: number) {
  const like = await prisma.like.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });
  return like;
}

async function findByUserAndArticle(userId: number, articleId: number) {
  const like = await prisma.like.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
  return like;
}

export default {
  findByUserAndProduct,
  findByUserAndArticle,
};
