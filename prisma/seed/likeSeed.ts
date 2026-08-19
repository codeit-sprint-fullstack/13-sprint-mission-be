import { Article, PrismaClient, Product, User } from "@prisma/client";

export async function seedLikes(
  prisma: PrismaClient,
  users: User[],
  products: Product[],
  articles: Article[],
) {
  for (const product of products) {
    const likers = [users[product.id % users.length], users[(product.id + 1) % users.length]];

    for (const liker of likers) {
      await prisma.like.create({
        data: { userId: liker.id, productId: product.id },
      });
      await prisma.product.update({
        where: { id: product.id },
        data: { favoriteCount: { increment: 1 } },
      });
    }
  }

  for (const article of articles) {
    const liker = users[(article.id + 2) % users.length];

    await prisma.like.create({
      data: { userId: liker.id, articleId: article.id },
    });
    await prisma.article.update({
      where: { id: article.id },
      data: { likeCount: { increment: 1 } },
    });
  }
}
