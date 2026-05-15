const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
   // 기존 데이터 초기화
   await prisma.articleComment.deleteMany();
   await prisma.article.deleteMany();

   // 더미 게시글 15개 생성
   for (let i = 1; i <= 15; i++) {
      await prisma.article.create({
         data: {
            title: `자유게시판 테스트 제목 ${i}`,
            content: `테스트 내용입니다. ${i}`,
         },
      });
   }
   console.log("시딩 완료");
}

main()
   .catch((e) => console.error(e))
   .finally(async () => await prisma.$disconnect());
