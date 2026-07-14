import prisma from "../config/prisma.js";
import likeRepository from "../repositories/likeRepository.js";

async function likeProduct(userId, productId) {
  const existingLike = await likeRepository.findByUserAndProduct(
    userId,
    productId,
  );
  if (existingLike) {
    const error = new Error("이미 좋아요를 누른 상품입니다.");
    error.code = 409;
    throw error;
  }

  const [like] = await prisma.$transaction([
    prisma.like.create({
      data: { userId, productId: Number(productId) },
    }),
    prisma.product.update({
      where: { id: Number(productId) },
      data: { favoriteCount: { increment: 1 } },
    }),
  ]);

  return like;
}

async function unlikeProduct(userId, productId) {
  const existingLike = await likeRepository.findByUserAndProduct(
    userId,
    productId,
  );
  if (!existingLike) {
    const error = new Error("좋아요를 누르지 않은 상품입니다.");
    error.code = 404;
    throw error;
  }

  await prisma.$transaction([
    prisma.like.delete({
      where: {
        userId_productId: { userId, productId: Number(productId) },
      },
    }),
    prisma.product.update({
      where: { id: Number(productId) },
      data: { favoriteCount: { decrement: 1 } },
    }),
  ]);
}

async function likeArticle(userId, articleId) {
  const existingLike = await likeRepository.findByUserAndArticle(
    userId,
    articleId,
  );
  if (existingLike) {
    const error = new Error("이미 좋아요를 누른 게시글입니다.");
    error.code = 409;
    throw error;
  }

  const [like] = await prisma.$transaction([
    prisma.like.create({
      data: { userId, articleId: Number(articleId) },
    }),
    prisma.article.update({
      where: { id: Number(articleId) },
      data: { likeCount: { increment: 1 } },
    }),
  ]);

  return like;
}

async function unlikeArticle(userId, articleId) {
  const existingLike = await likeRepository.findByUserAndArticle(
    userId,
    articleId,
  );
  if (!existingLike) {
    const error = new Error("좋아요를 누르지 않은 게시글입니다.");
    error.code = 404;
    throw error;
  }

  await prisma.$transaction([
    prisma.like.delete({
      where: {
        userId_articleId: { userId, articleId: Number(articleId) },
      },
    }),
    prisma.article.update({
      where: { id: Number(articleId) },
      data: { likeCount: { decrement: 1 } },
    }),
  ]);
}

export default {
  likeProduct,
  unlikeProduct,
  likeArticle,
  unlikeArticle,
};
