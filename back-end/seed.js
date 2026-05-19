import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log(" 기존 데이터를 삭제 중입니다...");
  await prisma.articleComment.deleteMany();
  await prisma.article.deleteMany();

  console.log("50개의 게시글과 댓글을 생성 중입니다...");
  for (let i = 1; i <= 50; i++) {
    const article = await prisma.article.create({
      data: {
        title: `이진태의 테스트 게시글 ${i}`,
        content: `이것은 ${i}번째 게시글의 상세 내용입니다. 마이그레이션 성공`,
      },
    });

    await prisma.articleComment.createMany({
      data: [
        { content: `${i}1댓글`, articleId: article.id },
        { content: `2댓글`, articleId: article.id },
        { content: `3댓글.`, articleId: article.id },
      ],
    });
  }

  console.log("댓글 시딩 완료!");
}

main()
  .catch((e) => {
    console.error("시딩 중 에러 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
