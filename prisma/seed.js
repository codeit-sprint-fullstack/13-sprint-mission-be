import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const randomProducts = () => {
  const products = [];

  for (let i = 1; i <= 50; i++) {
    products.push({
      name: `${i}진태`,
      description: `${i}번 상품 설명입니다`,
      price: Math.floor(Math.random() * 100000) + 1000,
      favoriteCount: Math.floor(Math.random() * 100),
      tags: "전자제품",
    });
  }

  return products;
};

const randomArticle = () => {
  const articles = [];

  for (let i = 0; i < 50; i++) {
    articles.push({
      title: faker.lorem.sentence(3),
      content: faker.lorem.sentence(10),
    });
  }
  return articles;
};

const randomComment = () => {
  const comments = [];

  for (let i = 0; i < 50; i++) {
    comments.push({
      content: faker.lorem.sentence(10),
      articleId: Math.floor(Math.random() * 50) + 1,
    });
  }
  return comments;
};

async function seed() {
  try {
    const products = randomProducts();
    const articles = randomArticle();
    const comments = randomComment();
    // 기존 데이터 삭제
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.product.deleteMany();

    console.log("🗑️ 기존 데이터 삭제 완료");

    // 데이터 삽입
    await prisma.product.createMany({
      data: products,
    });
    await prisma.article.createMany({
      data: articles,
    });
    await prisma.comment.createMany({
      data: comments,
    });
    console.log(`🌱 시드 데이터 상품 ${products.length}개 삽입 완료`);
    console.log(`🌱 시드 데이터 게시글${articles.length}개 삽입 완료`);
    console.log(`🌱 시드 데이터 댓글 ${comments.length}개 삽입 완료`);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();

    console.log("👋 DB 연결 종료");
  }
}

seed();
