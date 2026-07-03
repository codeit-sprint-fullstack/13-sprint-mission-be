import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const hashedPassword = bcrypt.hash("test1234!@", 10);

async function main() {
  //seeding 시작
  console.log("✅ seeding 시작");

  // 기존 데이터 삭제
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("📝 기존 데이터 삭제 완료");

  //유저 생성
  const user1 = await prisma.user.create({
    data: {
      name: "김유저",
      email: "user1@test.com",
      username: "user1",
      password: hashedPassword,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: "박유저",
      email: "user2@test.com",
      username: "user2",
      password: hashedPassword,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      name: "이유저",
      email: "user3@test.com",
      username: "user3",
      password: hashedPassword,
    },
  });
  const user4 = await prisma.user.create({
    data: {
      name: "정유저",
      email: "user4@test.com",
      username: "user4",
      password: hashedPassword,
    },
  });

  //상품 생성
  const products = [
    {
      name: "아나의 생체 슈류탄",
      description: "아군 사용시 힐증, 적군 사용시 힐밴",
      price: 52000,
      tags: ["힐러", "개사기"],
      favoriteCount: 2509127,
      userId: user1.id,
    },
    {
      name: "키리코의 방울",
      description: "폭힐 및 무적기",
      price: 50000,
      tags: ["힐러", "개사기"],
      favoriteCount: 3219856,
      userId: user1.id,
    },
    {
      name: "토르비욘의 망치",
      description: "꼬마 망치 나가신다",
      price: 9200,
      tags: ["딜러", "보조무기", "포탑깡깡", "망치살인마", "싸이코"],
      favoriteCount: 18,
      userId: user1.id,
    },
    {
      name: "메이의 설구",
      description: "주변을 얼리는 똑똑한 보조 로봇",
      price: 9200,
      tags: ["딜러", "개쓰레기궁", "제발열려줘", "싸이코"],
      favoriteCount: 287,
      userId: user1.id,
    },
    {
      name: "정커퀸의 그레이시",
      description: "부메랑처럼 돌아오는 신기한 칼",
      price: 15000,
      tags: ["탱커", "땡기기"],
      favoriteCount: 124,
      userId: user2.id,
    },
    {
      name: "우양의 물",
      description: "게이지 이제 없어",
      price: 52000,
      tags: ["힐러", "물부족", "게이지", "다개피"],
      favoriteCount: 2509127,
      userId: user2.id,
    },
    {
      name: "바스티온의 포격",
      description: "쀼쀼쀼 쀼 쀼 쀼쀼쀼 쀼 쀼",
      price: 52000,
      tags: ["딜러", "쾅쾅쾅", "제발맞아"],
      favoriteCount: 2642,
      userId: user2.id,
    },
    {
      name: "솜브라의 바이러스",
      description: "거의 반피를 깎는 투사체 스킬",
      price: 99999999,
      tags: ["딜러", "개사기"],
      favoriteCount: 2345678,
      userId: user2.id,
    },
    {
      name: "주노의 하이퍼링",
      description: "지나가면 빨라지는 화성의 링",
      price: 48000,
      tags: ["힐러", "이속", "화성에", "이런일이"],
      favoriteCount: 2509127,
      userId: user2.id,
    },
    {
      name: "브리기테의 방패",
      description: "작은 방패 나가신다",
      price: 52000,
      tags: ["힐러", "힐탱", "든든"],
      favoriteCount: 2509127,
      userId: user2.id,
    },
    {
      name: "루시우의 볼륨업",
      description: "이속시 이속증가, 힐할시 힐 증가",
      price: 52000,
      tags: ["힐러"],
      favoriteCount: 13,
      userId: user2.id,
    },
    {
      name: "루시우의 비트",
      description: "오우 제대로 놀아보자~~!!!",
      price: 98621,
      tags: ["힐러", "개사기", "뻥튀기"],
      favoriteCount: 16557,
      userId: user2.id,
    },
    {
      name: "아나의 생체 슈류탄",
      description: "아군 사용시 힐증, 적군 사용시 힐밴",
      price: 52000,
      tags: ["힐러", "개사기"],
      favoriteCount: 2509127,
      userId: user1.id,
    },
    {
      name: "메르시의 카데세우스 지팡이",
      description: "힐을 해드릴까요 공버프를 해드릴까요",
      price: 23000,
      tags: ["힐러", "노랑", "파랑", "번쩍번쩍"],
      favoriteCount: 159,
      userId: user1.id,
    },
    {
      name: "라마트라의 탐식의 소용돌이",
      description: "공중 적 요격, 적의 이속 감소",
      price: 19000,
      tags: ["탱커", "너프"],
      favoriteCount: 138,
      userId: user1.id,
    },
  ];
  await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          ...product,
          tags: {
            connectOrCreate: product.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
      }),
    ),
  );
  console.log(`📝 ${products.length}개 상품 생성`);

  // article 생성
  const articles = [
    {
      title: "오늘 점심 추천 받습니다. 일찍 일어났더니 배가 고프네요!!",
      content:
        "오늘 아침부터 배가 고파서 점심 메뉴를 고민하고 있습니다. 회사 근처에서 먹을 만한 음식이 있을까요? 너무 무겁지 않으면서도 든든하게 먹을 수 있는 메뉴 추천 부탁드립니다.",
      favoriteCount: 24,
      image: "https://picsum.photos/id/1011/600/400",
      createdAt: new Date("2026-06-13T09:12:00"),
      userId: user1.id,
    },
    {
      title: "요즘 재미있는 게임 있나요?",
      content:
        "최근에 즐길 만한 게임을 찾고 있습니다. 장르 상관없이 재미있게 플레이한 게임이 있다면 추천해주세요. PC 게임도 좋고 콘솔 게임도 좋습니다.",
      favoriteCount: 135,
      image: "https://picsum.photos/id/1025/600/400",
      createdAt: new Date("2026-06-12T18:42:00"),
      userId: user2.id,
    },
    {
      title: "출근길 지하철 사람이 너무 많네요",
      content:
        "출근길 지하철이 너무 혼잡해서 한 정거장 가는 것도 쉽지 않네요. 다들 출퇴근 시간에는 어떤 방법으로 시간을 보내시나요?",
      favoriteCount: 57,
      image: "https://picsum.photos/id/1043/600/400",
      createdAt: new Date("2026-06-12T08:15:00"),
      userId: user3.id,
    },
    {
      title: "주말에 한강 다녀왔습니다",
      content:
        "주말에 한강에 다녀왔는데 날씨도 좋고 사람들도 많았습니다. 오랜만에 여유를 즐기고 왔는데 여러분은 주말에 주로 어떤 활동을 하시나요?",
      favoriteCount: 312,
      image: "https://picsum.photos/id/1056/600/400",
      createdAt: new Date("2026-06-11T21:05:00"),
      userId: user4.id,
    },
    {
      title: "드디어 자격증 시험 합격했습니다",
      content:
        "몇 달 동안 준비했던 자격증 시험에 드디어 합격했습니다. 공부하는 동안 힘들었지만 결과가 좋아서 정말 기쁩니다. 비슷한 시험 준비 중인 분들도 응원합니다.",
      favoriteCount: 1289,
      image: "https://picsum.photos/id/1069/600/400",
      createdAt: new Date("2026-06-11T14:22:00"),
      userId: user1.id,
    },
  ];
  await Promise.all(
    articles.map((article) => prisma.article.create({ data: article })),
  );
  console.log(`📝 ${articles.length}개 글 생성`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
