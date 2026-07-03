// ============================================================
// Seed Script
// - schema.prisma 기준으로 더미 데이터 생성 (faker 사용)
// ============================================================

import bcrypt from "bcrypt";
import { fakerKO as faker } from "@faker-js/faker";
import prisma from "../src/config/prisma.js";

const USER_COUNT = 15;
const PRODUCT_COUNT = 40;
const ARTICLE_COUNT = 25;
const MAX_COMMENTS_PER_ITEM = 4;
const MAX_LIKES_PER_ITEM = 6;

const TAG_POOL = [
  "전자",
  "가전",
  "의류",
  "도서",
  "가구",
  "잡화",
  "뷰티",
  "식품",
  "완구",
  "스포츠",
  "반려",
  "취미",
];

// bcrypt 해싱은 느리므로 seed 데이터는 하나의 해시를 공유해서 사용
const SEED_PASSWORD_HASH = await bcrypt.hash("Password123!", 10);

function pickRandomSubset(items, max) {
  const count = faker.number.int({ min: 0, max: Math.min(max, items.length) });
  return faker.helpers.arrayElements(items, count);
}

async function clearDatabase() {
  await prisma.productLike.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.productComment.deleteMany();
  await prisma.articleComment.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const users = [];
  for (let i = 0; i < USER_COUNT; i += 1) {
    const user = await prisma.user.create({
      data: {
        nickname: faker.person.firstName(),
        email: faker.internet.email().toLowerCase(),
        password: SEED_PASSWORD_HASH,
        avatar: faker.datatype.boolean() ? faker.image.avatar() : null,
      },
    });
    users.push(user);
  }
  return users;
}

async function seedProducts(users) {
  const products = [];
  for (let i = 0; i < PRODUCT_COUNT; i += 1) {
    const owner = faker.helpers.arrayElement(users);
    const imageCount = faker.number.int({ min: 1, max: 3 });

    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName().slice(0, 100),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price({ min: 1000, max: 500000, dec: 0 })),
        images: Array.from({ length: imageCount }, () => faker.image.urlPicsumPhotos()),
        ownerId: owner.id,
        tags: {
          create: faker.helpers
            .arrayElements(TAG_POOL, faker.number.int({ min: 1, max: 3 }))
            .map((tag) => ({ tag })),
        },
      },
    });
    products.push(product);
  }
  return products;
}

async function seedArticles(users) {
  const articles = [];
  for (let i = 0; i < ARTICLE_COUNT; i += 1) {
    const owner = faker.helpers.arrayElement(users);

    const article = await prisma.article.create({
      data: {
        title: faker.lorem.sentence({ min: 3, max: 8 }),
        content: faker.lorem.paragraphs({ min: 1, max: 3 }),
        ownerId: owner.id,
      },
    });
    articles.push(article);
  }
  return articles;
}

async function seedProductComments(users, products) {
  for (const product of products) {
    const commenters = pickRandomSubset(users, MAX_COMMENTS_PER_ITEM);
    for (const commenter of commenters) {
      await prisma.productComment.create({
        data: {
          content: faker.lorem.sentence(),
          ownerId: commenter.id,
          productId: product.id,
        },
      });
    }
  }
}

async function seedArticleComments(users, articles) {
  for (const article of articles) {
    const commenters = pickRandomSubset(users, MAX_COMMENTS_PER_ITEM);
    for (const commenter of commenters) {
      await prisma.articleComment.create({
        data: {
          content: faker.lorem.sentence(),
          ownerId: commenter.id,
          articleId: article.id,
        },
      });
    }
  }
}

async function seedProductLikes(users, products) {
  for (const product of products) {
    const likers = pickRandomSubset(users, MAX_LIKES_PER_ITEM);
    for (const liker of likers) {
      await prisma.productLike.create({
        data: {
          ownerId: liker.id,
          productId: product.id,
        },
      });
    }
  }
}

async function seedArticleLikes(users, articles) {
  for (const article of articles) {
    const likers = pickRandomSubset(users, MAX_LIKES_PER_ITEM);
    for (const liker of likers) {
      await prisma.articleLike.create({
        data: {
          ownerId: liker.id,
          articleId: article.id,
        },
      });
    }
  }
}

async function main() {
  await clearDatabase();

  const users = await seedUsers();
  const products = await seedProducts(users);
  const articles = await seedArticles(users);

  await seedProductComments(users, products);
  await seedArticleComments(users, articles);
  await seedProductLikes(users, products);
  await seedArticleLikes(users, articles);

  console.log(
    `✅ Seed 완료 — users: ${users.length}, products: ${products.length}, articles: ${articles.length}`,
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed 실패:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
