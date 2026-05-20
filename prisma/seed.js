import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 20; i++) {
    await prisma.product.create({
      data: {
        name: "애플 에어팟 프로",
        description: "애플 에어팟 프로 상품입니다.",
        price: 120000,
        tags: ["전자기기"],
      },
    });
  }

  for (let i = 1; i <= 20; i++) {
    await prisma.article.create({
      data: {
        title: "맥북 16인치 16기가 1테라 하드 사양이면 얼마에 팔아야하나요?",
        content: "맥북 16인치 16기가 1테라 사양이면 얼마에 팔아야하나요?",
      },
    });
  }

  await prisma.articleComment.createMany({
    data: [
      {
        content: "혹시 사용기간이 어떻게 되실까요?",
        articleId: 1,
      },
      {
        content: "혹시 사용기간이 어떻게 되실까요?",
        articleId: 2,
      },
      {
        content: "혹시 사용기간이 어떻게 되실까요?",
        articleId: 3,
      },
    ],
  });

  await prisma.productComment.createMany({
    data: [
      {
        content: "혹시 사용기간이 어떻게 되실까요?",
        productId: 1,
      },
      {
        content: "혹시 사용기간이 어떻게 되실까요?",
        productId: 2,
      },
      {
        content: "혹시 사용기간이 어떻게 되실까요?",
        productId: 3,
      },
    ],
  });

  console.log("시딩 완료");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });