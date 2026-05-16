import prisma from "../src/configs/prisma.js";

async function main() {
  await prisma.article.createMany({
    data: [
      {
        title: "첫 게시글",
        content: "내용입니다",
      },

      {
        title: "두번째 게시글",
        content: "테스트",
      },
    ],
  });

  await prisma.article.createMany({
    data: [
      {
        name: "맥북",
      },
      {
        name: "키보드",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
  });
