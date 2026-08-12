import prisma from "../config/prisma.js";
import HttpError from "../errors/HttpError.js";
import likeRepository from "../repositories/likeRepository.js";

async function likeProduct(userId: number, productId: number) {
  const existingLike = await likeRepository.findByUserAndProduct(
    userId,
    productId,
  );
  if (existingLike) {
    throw new HttpError("이미 좋아요를 누른 상품입니다.", 409);
  }

  const [like] = await prisma.$transaction([
    prisma.like.create({
      data: { userId, productId },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { favoriteCount: { increment: 1 } },
    }),
  ]);

  return like;
}

async function unlikeProduct(userId: number, productId: number) {
  const existingLike = await likeRepository.findByUserAndProduct(
    userId,
    productId,
  );
  if (!existingLike) {
    throw new HttpError("좋아요를 누르지 않은 상품입니다.", 404);
  }

  await prisma.$transaction([
    prisma.like.delete({
      where: {
        userId_productId: { userId, productId },
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { favoriteCount: { decrement: 1 } },
    }),
  ]);
}

async function likeArticle(userId: number, articleId: number) {
  const existingLike = await likeRepository.findByUserAndArticle(
    userId,
    articleId,
  );
  if (existingLike) {
    throw new HttpError("이미 좋아요를 누른 게시글입니다.", 409);
  }

  const [like] = await prisma.$transaction([
    prisma.like.create({
      data: { userId, articleId },
    }),
    prisma.article.update({
      where: { id: articleId },
      data: { likeCount: { increment: 1 } },
    }),
  ]);

  return like;
}

async function unlikeArticle(userId: number, articleId: number) {
  const existingLike = await likeRepository.findByUserAndArticle(
    userId,
    articleId,
  );
  if (!existingLike) {
    throw new HttpError("좋아요를 누르지 않은 게시글입니다.", 404);
  }

  await prisma.$transaction([
    prisma.like.delete({
      where: {
        userId_articleId: { userId, articleId },
      },
    }),
    prisma.article.update({
      where: { id: articleId },
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
