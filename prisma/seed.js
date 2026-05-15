const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
   console.log("데이터베이스 시딩을 시작합니다...");

   // 기존 데이터 초기화
   await prisma.articleComment.deleteMany();
   await prisma.productComment.deleteMany();
   await prisma.article.deleteMany();
   await prisma.product.deleteMany();

   // 자유게시판 더미 데이터 생성
   for (let i = 1; i <= 15; i++) {
      await prisma.article.create({
         data: {
            title: `자유게시판 테스트 제목 ${i}`,
            content: `테스트 내용입니다. ${i}`,
         },
      });
   }

   // 중고마켓 더미 데이터 생성
   await prisma.product.create({
      data: {
         name: "테스트용 상품",
         description: "댓글 기능 테스트를 위한 상품입니다.",
         price: 15000,
      },
   });

   console.log("데이터베이스 시딩이 완료되었습니다.");
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
