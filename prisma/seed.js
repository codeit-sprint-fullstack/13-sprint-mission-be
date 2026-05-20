import prisma from "../src/lib/prisma.js";
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "qwer@render.com" },
    update: {},
    create: {
      email: "qwer@render.com",
      nickname: "Alice",
      password: "qwer",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "asdf@render.com" },
    update: {},
    create: {
      email: "asdf@render.com",
      nickname: "Bob",
      password: "asdf",
    },
  });

  console.log(`사용자 생성`);

  const products = await prisma.product.createMany({
    data: [
      {
        name: "로지텍 마우스",
        description: "그립감 좋고, 튼튼한 로지텍 마우스입니다.",
        price: 100000,
        favoriteCount: 4,
        userId: alice.id,
      },
      {
        name: "삼성 모니터",
        description: "눈이 편한 27인치 삼성 모니터입니다.",
        price: 350000,
        favoriteCount: 12,
        userId: alice.id,
      },
      {
        name: "애플 키보드",
        description: "얇고 세련된 디자인의 애플 매직 키보드입니다.",
        price: 129000,
        favoriteCount: 8,
        userId: alice.id,
      },
      {
        name: "소니 헤드폰",
        description: "노이즈 캔슬링 기능이 탁월한 소니 무선 헤드폰입니다.",
        price: 280000,
        favoriteCount: 21,
        userId: alice.id,
      },
      {
        name: "아이패드 거치대",
        description: "각도 조절이 자유로운 알루미늄 태블릿 거치대입니다.",
        price: 35000,
        favoriteCount: 6,
        userId: bob.id,
      },
      {
        name: "USB-C 허브",
        description: "7포트 지원 고속 데이터 전송 USB-C 허브입니다.",
        price: 55000,
        favoriteCount: 15,
        userId: bob.id,
      },
    ],
  });
  console.log(`${products.count}개 상품 생성`);

  const articles = await prisma.article.create({
    data: {
      title: "맥북 16인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
      content: "맥북 16인치 16기가 1테라 정도 사양이면 얼마에 팔아야하나요?",
      userId: bob.id,
    },
  });
  console.log(`${articles.count}개 게시글 생성`);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
