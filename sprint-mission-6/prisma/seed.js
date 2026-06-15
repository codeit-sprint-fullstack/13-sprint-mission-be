import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("seeding start!");

  await prisma.articleComment.deleteMany({});
  await prisma.productComment.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.article.deleteMany({});

  console.log("delete completed!");

  const p1 = await prisma.product.create({
    data: {
      name: "빈티지 가죽 자켓",
      description: "상태 아주 좋은 리얼 가죽 빈티지 자켓입니다.",
      price: 85000,
    },
  });

  const p2 = await prisma.product.create({
    data: {
      name: "무선 기계식 키보드",
      description: "갈축 스위치 블루투스 키보드",
      price: 120000,
    },
  });

  const p3 = await prisma.product.create({
    data: {
      name: "아이패드 에어 5세대",
      description: "기스 없음",
      price: 580000,
    },
  });

  const p4 = await prisma.product.create({
    data: {
      name: "캠핑용 미니 버너",
      description: "화력 좋음",
      price: 25000,
    },
  });

  const p5 = await prisma.product.create({
    data: {
      name: "스탠리 텀블러",
      description: "미개봉",
      price: 35000,
    },
  });

  await prisma.tag.createMany({
    data: [
      { name: "의류", productId: p1.id },
      { name: "빈티지", productId: p1.id },
      { name: "가죽자켓", productId: p1.id },

      { name: "전자기기", productId: p2.id },
      { name: "키보드", productId: p2.id },

      { name: "애플", productId: p3.id },
      { name: "태블릿", productId: p3.id },

      { name: "캠핑", productId: p4.id },

      { name: "텀블러", productId: p5.id },
    ],
  });

  const a1 = await prisma.article.create({
    data: {
      title: "맥북 M1 판매합니다",
      content: "실사용 2년, 상태 좋습니다.",
    },
  });

  const a2 = await prisma.article.create({
    data: {
      title: "탑싯 공부 같이 하실 분",
      content: "주말 스터디 모집합니다.",
    },
  });

  const a3 = await prisma.article.create({
    data: {
      title: "Express + Prisma 질문",
      content: "pagination 구현 중 막힘",
    },
  });

  await prisma.articleComment.createMany({
    data: [
      { content: "가격 괜찮네요", articleId: a1.id },
      { content: "네고 가능할까요?", articleId: a1.id },

      { content: "참여하고 싶습니다", articleId: a2.id },
      { content: "장소가 어디인가요?", articleId: a2.id },

      { content: "cursor pagination 추천", articleId: a3.id },
    ],
  });

  await prisma.productComment.createMany({
    data: [
      { content: "이거 상태 진짜 좋네요", productId: p1.id },
      { content: "사이즈 있나요?", productId: p1.id },

      { content: "키감 어떤가요?", productId: p2.id },
      { content: "배터리 오래가나요?", productId: p2.id },

      { content: "아이패드 가격 괜찮네요", productId: p3.id },
      { content: "애플펜슬 포함인가요?", productId: p3.id },

      { content: "캠핑용으로 딱이네요", productId: p4.id },

      { content: "텀블러 디자인 예쁘다", productId: p5.id },
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
