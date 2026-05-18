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
      tags: ["전자제품"],
    });
  }

  return products;
};

const randomArticles = () => {
  const articles = [];

  for (let i = 1; i <= 50; i++) {
    articles.push({
      title: faker.lorem.sentence(3),
      content: faker.lorem.sentence(10),
    });
  }

  return articles;
};

const randomArticleComments = (articleIds) => {
  const comments = [];

  for (let i = 1; i <= 50; i++) {
    const randomArticle =
      articleIds[Math.floor(Math.random() * articleIds.length)];

    comments.push({
      content: faker.lorem.sentence(10),
      articleId: randomArticle.id,
    });
  }

  return comments;
};

const randomProductComments = (productIds) => {
  const comments = [];

  for (let i = 1; i <= 50; i++) {
    const randomProduct =
      productIds[Math.floor(Math.random() * productIds.length)];

    comments.push({
      content: faker.lorem.sentence(10),
      productId: randomProduct.id,
    });
  }

  return comments;
};

async function seed() {
  try {
    const products = randomProducts();
    const articles = randomArticles();

    // 기존 데이터 삭제
    await prisma.articleComment.deleteMany();
    await prisma.productComment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.product.deleteMany();

    console.log("🗑️ 기존 데이터 삭제 완료");

    // 상품 생성
    await prisma.product.createMany({
      data: products,
    });

    // 게시글 생성
    await prisma.article.createMany({
      data: articles,
    });

    // 실제 생성된 상품 id 조회
    const savedProducts = await prisma.product.findMany({
      select: {
        id: true,
      },
    });

    // 실제 생성된 게시글 id 조회
    const savedArticles = await prisma.article.findMany({
      select: {
        id: true,
      },
    });

    // 댓글 데이터 생성
    const articleComments = randomArticleComments(savedArticles);
    const productComments = randomProductComments(savedProducts);

    // 게시글 댓글 생성
    await prisma.articleComment.createMany({
      data: articleComments,
    });

    // 상품 댓글 생성
    await prisma.productComment.createMany({
      data: productComments,
    });

    console.log(`🌱 상품 데이터 ${products.length}개 삽입 완료`);
    console.log(`🌱 게시글 데이터 ${articles.length}개 삽입 완료`);
    console.log(
      `🌱 게시글 댓글 데이터 ${articleComments.length}개 삽입 완료`,
    );
    console.log(
      `🌱 상품 댓글 데이터 ${productComments.length}개 삽입 완료`,
    );
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();

    console.log("👋 DB 연결 종료");
  }
}

seed();