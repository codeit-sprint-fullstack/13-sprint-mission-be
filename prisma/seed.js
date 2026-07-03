require("../src/config/env");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const encryptedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@panda.dev" },
    update: {
      nickname: "김코드",
      image: "",
      encryptedPassword,
    },
    create: {
      id: "user_demo",
      email: "demo@panda.dev",
      nickname: "김코드",
      image: "",
      encryptedPassword,
    },
  });

  await prisma.product.upsert({
    where: { id: "product_1" },
    update: {},
    create: {
      id: "product_1",
      name: "하늘색 티셔츠",
      description: "가볍게 입기 좋은 깨끗한 반팔 티셔츠입니다.",
      price: 12000,
      tags: ["티셔츠", "상의"],
      imageUrls: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop",
      ],
      ownerId: user.id,
    },
  });

  await prisma.product.upsert({
    where: { id: "product_2" },
    update: {},
    create: {
      id: "product_2",
      name: "노트북 파우치",
      description: "맥북 16인치까지 들어가는 튼튼한 파우치입니다.",
      price: 18000,
      tags: ["파우치", "노트북"],
      imageUrls: [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop",
      ],
      ownerId: user.id,
    },
  });

  await prisma.article.upsert({
    where: { id: "article_1" },
    update: {},
    create: {
      id: "article_1",
      title: "맥북 16인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
      content:
        "상태는 깨끗하고 배터리도 괜찮은 편입니다. 적정 판매가 의견 부탁드려요.",
      imageUrls: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop",
      ],
      ownerId: user.id,
    },
  });

  await prisma.productLike.upsert({
    where: { productId_userId: { productId: "product_2", userId: user.id } },
    update: {},
    create: {
      id: "product_like_demo",
      productId: "product_2",
      userId: user.id,
    },
  });

  await prisma.articleLike.upsert({
    where: { articleId_userId: { articleId: "article_1", userId: user.id } },
    update: {},
    create: {
      id: "article_like_demo",
      articleId: "article_1",
      userId: user.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
