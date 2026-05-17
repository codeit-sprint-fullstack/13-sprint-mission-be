// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.articleComment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.productComment.deleteMany();
  await prisma.product.deleteMany();

  console.log("🌱 시딩 시작...");

  for (let i = 1; i <= 5; i++) {
    const article = await prisma.article.create({
      data: {
        title: `자유게시판 테스트 제목 ${i}`,
        content: `자유게시판 내용입니다. 미션 6 테스트 중입니다. (${i})`,
        comments: {
          create: [
            { content: `첫 번째 댓글입니다 ${i}` },
            { content: `두 번째 댓글입니다 ${i}` },
          ],
        },
      },
    });
    console.log(`Created article with id: ${article.id}`);
  }

  for (let i = 1; i <= 5; i++) {
    const product = await prisma.product.create({
      data: {
        name: `중고 맥북 M1 ${i}`,
        description: `싸게 팝니다. 상태 A급 ${i}`,
        price: 1000000 + i * 10000,
        tags: ["애플", "맥북", "노트북"],
        // 5. 댓글(ProductComment)도 같이 생성
        comments: {
          create: [{ content: `쿨거래 원합니다 ${i}` }],
        },
      },
    });
    console.log(`Created product with id: ${product.id}`);
  }

  console.log("✅ 시딩 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
