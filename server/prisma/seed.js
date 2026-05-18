const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.productComment.deleteMany();
  await prisma.articleComment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();

  const product1 = await prisma.product.create({
    data: {
      name: "맥북 파우치",
      description: "거의 새 상품입니다.",
      price: 12000,
      // 변경: tags는 문자열로 저장합니다.
      tags: "파우치,노트북",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "무선 키보드",
      description: "작동 잘 됩니다.",
      price: 25000,
      // 변경: tags는 문자열로 저장합니다.
      tags: "키보드,전자기기",
    },
  });

  const article1 = await prisma.article.create({
    data: {
      title: "판다마켓 사용 후기",
      content: "처음 만들어본 게시글입니다.",
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "중고거래 팁",
      content: "상품 설명은 자세히 쓰는 게 좋은 것 같습니다.",
    },
  });

  await prisma.productComment.createMany({
    data: [
      { productId: product1.id, content: "아직 판매 중인가요?" },
      { productId: product2.id, content: "택배 가능할까요?" },
    ],
  });

  await prisma.articleComment.createMany({
    data: [
      { articleId: article1.id, content: "저도 써봤는데 좋아요." },
      { articleId: article2.id, content: "좋은 정보 감사합니다." },
    ],
  });

  console.log("시드 데이터 생성 완료");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
