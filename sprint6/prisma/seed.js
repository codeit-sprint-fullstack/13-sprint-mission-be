import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  //   await prisma.todo.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
  console.log("🧹 기존 데이터 삭제 완료");

  // --- 유저 생성 ---
  const alice = await prisma.user.create({ data: { name: "Alice" } });
  const bob = await prisma.user.create({ data: { name: "Bob" } });
  const chiikawa = await prisma.user.create({ data: { name: "Chiikawa" } });
  const hachiware = await prisma.user.create({ data: { name: "Hachiware" } });
  const usagi = await prisma.user.create({ data: { name: "Usagi" } });
  console.log("👥 user 5명 생성 ");

  // ----------- 자유게시판 생성-----------
  const article1 = await prisma.article.create({
    data: {
      title: "자유게시판 제목",
      content: "자유게시판 내용 확인인",
      userId: alice.id,
    },
  });
  const article2 = await prisma.article.create({
    data: {
      title: "이게 무슨일이야",
      content: "이렇게 좋은날에",
      userId: bob.id,
    },
  });
  const article3 = await prisma.article.create({
    data: {
      title: "치이카와",
      content: "치이카와 너무 귀여워",
      userId: chiikawa.id,
    },
  });
  const article4 = await prisma.article.create({
    data: {
      title: "우사기",
      content: "우사기는 맛있는걸 좋아해",
      userId: usagi.id,
    },
  });

  console.log("자유게시판 게시글 4개 생성");

  // ----------- 댓글 생성 (게시글/작성자 연결) -----------
  await prisma.comment.create({
    data: {
      content: "게시글1 댓글 확인용",
      articleId: article1.id,
      userId: bob.id,
    },
  });
  await prisma.comment.create({
    data: {
      content: "치이카와 판매해요",
      articleId: article2.id,
      userId: alice.id,
    },
  });

  console.log("comment 2개 생성");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
