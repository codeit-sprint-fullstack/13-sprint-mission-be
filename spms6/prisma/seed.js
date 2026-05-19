import { prisma } from "../src/prisma.js";
import { articles, products } from "./seedData.js";

async function seed() {
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  //   await prisma.tag.deleteMany(); onDelete(cascade) 있어서 두개 삭제하면 다 삭제됨

  console.log("기존 데이터 삭제 완료");

  await Promise.all(products.map((data) => prisma.product.create({ data })));

  console.log(`${products.length}개 제품 생성`);

  await Promise.all(articles.map((data) => prisma.article.create({ data })));

  console.log(`${articles.length}개 게시물 생성`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
