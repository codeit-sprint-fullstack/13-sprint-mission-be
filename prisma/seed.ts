import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const encryptedPassword = await bcrypt.hash("password123!", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      id: "user_test",
      email: "test@example.com",
      nickname: "테스트유저",
      encryptedPassword,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        id: "product_1",
        name: "아이패드 미니 팝니다.",
        description: "상태 좋은 아이패드 미니입니다.",
        price: 500000,
        tags: ["아이패드", "미니", "태블릿"],
        imageUrls: ["https://picsum.photos/seed/ipad/800/600"],
        ownerId: user.id,
      },
      {
        id: "product_2",
        name: "로봇 청소기",
        description: "거의 새 상품입니다.",
        price: 1500000,
        tags: ["청소기", "가전"],
        imageUrls: ["https://picsum.photos/seed/robot-cleaner/800/600"],
        ownerId: user.id,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.article.createMany({
    data: [
      {
        id: "article_1",
        title: "혹시 사용기간이 어떻게 되나요?",
        content: "상품 사용 기간이 궁금합니다.",
        imageUrl: "https://picsum.photos/seed/article/800/600",
        ownerId: user.id,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    console.log("Seed complete");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
