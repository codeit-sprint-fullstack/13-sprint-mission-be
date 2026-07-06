import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log("🌱 시딩 시작...");

  // FK 순서 고려: 자식 -> 부모 순으로 삭제
  await prisma.like.deleteMany();
  await prisma.productComment.deleteMany();
  await prisma.articleComment.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123!", SALT_ROUNDS);

  const [alice, bob, charlie] = await Promise.all([
    prisma.user.create({
      data: {
        nickname: "김민지",
        email: "alice@example.com",
        encryptedPassword: password,
      },
    }),
    prisma.user.create({
      data: {
        nickname: "이준호",
        email: "bob@example.com",
        encryptedPassword: password,
      },
    }),
    prisma.user.create({
      data: {
        nickname: "박서연",
        email: "charlie@example.com",
        encryptedPassword: password,
      },
    }),
  ]);
  console.log("✅ 유저 생성 완료");

  const product1 = await prisma.product.create({
    data: {
      name: "아이패드 프로 11인치",
      description: "거의 새 제품, 케이스랑 펜슬 포함해서 팝니다.",
      price: 850000,
      images: ["/uploads/sample-ipad-1.jpg"],
      userId: alice.id,
      tags: { create: [{ name: "전자기기" }, { name: "애플" }] },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "무선 청소기",
      description: "작년에 구매한 무선 청소기, 흡입력 좋아요.",
      price: 120000,
      images: ["/uploads/sample-vacuum-1.jpg"],
      userId: bob.id,
      tags: { create: [{ name: "가전" }, { name: "생활용품" }] },
    },
  });

  await prisma.product.create({
    data: {
      name: "원목 책상",
      description: "이사 때문에 급처합니다. 상태 좋아요.",
      price: 60000,
      images: [],
      userId: charlie.id,
      tags: { create: [{ name: "가구" }] },
    },
  });
  console.log("✅ 상품 생성 완료");

  const article1 = await prisma.article.create({
    data: {
      title: "오늘 날씨 진짜 좋네요",
      content: "다들 산책 한 번씩 다녀오세요!",
      userId: alice.id,
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "중고거래 사기 조심하세요",
      content:
        "최근에 사기 사례가 늘고 있으니 직거래 위주로 하시길 추천드려요.",
      userId: bob.id,
    },
  });
  console.log("✅ 게시글 생성 완료");

  await prisma.productComment.createMany({
    data: [
      {
        content: "가격 조금만 깎아주실 수 있나요?",
        productId: product1.id,
        userId: bob.id,
      },
      {
        content: "직거래 가능한가요?",
        productId: product1.id,
        userId: charlie.id,
      },
      {
        content: "아직 판매 중인가요?",
        productId: product2.id,
        userId: alice.id,
      },
    ],
  });

  await prisma.articleComment.createMany({
    data: [
      {
        content: "좋은 정보 감사합니다!",
        articleId: article2.id,
        userId: charlie.id,
      },
      {
        content: "저도 예전에 당할 뻔했어요 ㅠㅠ",
        articleId: article2.id,
        userId: alice.id,
      },
    ],
  });
  console.log("✅ 댓글 생성 완료");

  await prisma.like.createMany({
    data: [
      { userId: bob.id, productId: product1.id },
      { userId: charlie.id, productId: product1.id },
      { userId: alice.id, productId: product2.id },
      { userId: charlie.id, articleId: article1.id },
      { userId: bob.id, articleId: article1.id },
    ],
  });
  console.log("✅ 좋아요 생성 완료");

  console.log("🌱 시딩 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
