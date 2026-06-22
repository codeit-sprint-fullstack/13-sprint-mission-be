import { PrismaClient } from "@prisma/client";
import { fakerKO } from "@faker-js/faker";
import dotenv from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const prisma = new PrismaClient();

async function main() {
  await prisma.article.deleteMany();

  console.log("🧹 기존 데이터 삭제 완료");

  const articleIds = [];

  for (let i = 0; i < 30; i++) {
    const article = await prisma.article.create({
      data: {
        title: fakerKO.lorem.sentence(3),
        content: fakerKO.lorem.sentence(10),
      },
    });
    articleIds.push(article.id);
  }

  const randomComments = [];

  for (let i = 0; i < 10; i++) {
    randomComments.push({
      content: fakerKO.lorem.sentence(3),
      articleId: articleIds[Math.floor(Math.random() * articleIds.length)],
    });
  }

  await prisma.comment.createMany({ data: randomComments });

  console.log("🎲 한국어 랜덤 게시글 30개 댓글 10개 생성");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
