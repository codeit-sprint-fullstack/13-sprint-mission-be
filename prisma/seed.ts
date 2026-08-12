import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seed/userSeed.js";
import { seedProducts } from "./seed/productSeed.js";
import { seedArticles } from "./seed/articleSeed.js";
import { seedComments } from "./seed/commentSeed.js";
import { seedLikes } from "./seed/likeSeed.js";

const prisma = new PrismaClient();

async function clear() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await clear();

  const users = await seedUsers(prisma);
  const products = await seedProducts(prisma, users);
  const articles = await seedArticles(prisma, users);
  await seedComments(prisma, users, products, articles);
  await seedLikes(prisma, users, products, articles);

  console.log(
    `시드 완료: users ${users.length}, products ${products.length}, articles ${articles.length}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
