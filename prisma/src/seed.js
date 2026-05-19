const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시딩 시작...");


  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();


  for (let i = 1; i <= 10; i++) {
    await prisma.article.create({
      data: {
        title: `자유게시판 테스트 제목 ${i}`,
        content: `이것은 테스트 본문 내용입니다. 단어 검색용 키워드 포함 ${i}`,
        comments: {
          create: [
            { content: `게시글 ${i}에 대한 첫 번째 댓글입니다.` },
            { content: `게시글 ${i}에 대한 두 번째 댓글입니다.` },
            { content: `게시글 ${i}에 대한 세 번째 댓글입니다.` },
          ],
        },
      },
    });
  }

  console.log("✅ 시딩 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시딩 중 에러 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
