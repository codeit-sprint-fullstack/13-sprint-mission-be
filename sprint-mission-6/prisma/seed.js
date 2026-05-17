// [ ] 데이터베이스 시딩 코드를 작성해 주세요.
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("seeding start!");
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  console.log("delete completed!");

  const article1 = await prisma.article.create({
    data: {
      title: "맥북 M1 판매합니다",
      content: "실사용 2년, 상태 좋습니다.",
    },
  });
  const article2 = await prisma.article.create({
    data: {
      title: "탑싯 공부 같이 하실 분",
      content: "주말마다 스터디 모집합니다.",
    },
  });
  const article3 = await prisma.article.create({
    data: {
      title: "Express + Prisma 질문",
      content: "pagination 구현 중 막혔어요.",
    },
  });
  await prisma.comment.createMany({
    data: [
      {
        content: "가격 괜찮네요.",
        articleId: article1.id,
      },
      {
        content: "네고 가능할까요?",
        articleId: article1.id,
      },
      {
        content: "참여하고 싶습니다.",
        articleId: article2.id,
      },
      {
        content: "장소가 어디인가요?",
        articleId: article2.id,
      },
      {
        content: "저도 같은 부분 궁금했어요.",
        articleId: article3.id,
      },
      {
        content: "cursor pagination 추천합니다.",
        articleId: article3.id,
      },
    ],
  });

  console.log("seed 완료");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
