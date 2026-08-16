// seed.js
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const seedData = [
  {
    name: "레노버 노트북",
    price: 1500000,
    description:
      "레노버 씽크패드 최신형 노트북입니다. 성능이 뛰어나고 가볍습니다.",
    tags: ["#노트북", "#레노버"],
  },
  {
    name: "삼성 갤럭시북",
    price: 1200000,
    description: "삼성 갤럭시북 최신형입니다. 가볍고 배터리가 오래갑니다.",
    tags: ["#노트북", "#삼성"],
  },
  {
    name: "애플 맥북프로",
    price: 2500000,
    description: "애플 맥북프로 M3칩 탑재 모델입니다. 빠르고 강력합니다.",
    tags: ["#노트북", "#애플"],
  },
  {
    name: "나이키 운동화",
    price: 150000,
    description:
      "나이키 에어맥스 최신형 운동화입니다. 편안하고 스타일리시합니다.",
    tags: ["#운동화", "#나이키"],
  },
  {
    name: "아디다스 운동화",
    price: 130000,
    description: "아디다스 울트라부스트 운동화입니다. 쿠션감이 뛰어납니다.",
    tags: ["#운동화", "#아디다스"],
  },
  {
    name: "소니 헤드폰",
    price: 350000,
    description:
      "소니 WH-1000XM5 노이즈캔슬링 헤드폰입니다. 음질이 최고입니다.",
    tags: ["#헤드폰", "#소니"],
  },
  {
    name: "에어팟 프로",
    price: 320000,
    description:
      "애플 에어팟 프로 2세대입니다. 노이즈캔슬링과 음질이 훌륭합니다.",
    tags: ["#이어폰", "#애플"],
  },
  {
    name: "LG 모니터",
    price: 450000,
    description: "LG 27인치 4K 모니터입니다. 색감이 뛰어나고 눈이 편합니다.",
    tags: ["#모니터", "#LG"],
  },
  {
    name: "로지텍 마우스",
    price: 80000,
    description:
      "로지텍 MX Master 3 무선 마우스입니다. 손에 딱 맞고 편안합니다.",
    tags: ["#마우스", "#로지텍"],
  },
  {
    name: "키크론 키보드",
    price: 120000,
    description: "키크론 K2 무선 기계식 키보드입니다. 타건감이 훌륭합니다.",
    tags: ["#키보드", "#키크론"],
  },
  {
    name: "아이패드 프로",
    price: 1300000,
    description:
      "애플 아이패드 프로 12.9인치입니다. 그림 그리기와 영상 편집에 최적입니다.",
    tags: ["#태블릿", "#애플"],
  },
  {
    name: "갤럭시 탭",
    price: 900000,
    description: "삼성 갤럭시 탭 S9입니다. 화면이 크고 선명합니다.",
    tags: ["#태블릿", "#삼성"],
  },
  {
    name: "닌텐도 스위치",
    price: 360000,
    description:
      "닌텐도 스위치 OLED 모델입니다. 집에서도 밖에서도 즐길 수 있습니다.",
    tags: ["#게임기", "#닌텐도"],
  },
  {
    name: "플레이스테이션5",
    price: 750000,
    description:
      "소니 플레이스테이션5 디스크 에디션입니다. 최고의 게임 경험을 제공합니다.",
    tags: ["#게임기", "#소니"],
  },
  {
    name: "다이슨 청소기",
    price: 800000,
    description: "다이슨 V15 무선 청소기입니다. 흡입력이 강력하고 가볍습니다.",
    tags: ["#청소기", "#다이슨"],
  },
  {
    name: "네스프레소 커피머신",
    price: 250000,
    description:
      "네스프레소 버츄오 커피머신입니다. 캡슐 하나로 카페 수준의 커피를 즐기세요.",
    tags: ["#커피머신", "#네스프레소"],
  },
  {
    name: "필립스 공기청정기",
    price: 350000,
    description:
      "필립스 공기청정기 AC2887입니다. 미세먼지와 바이러스를 제거합니다.",
    tags: ["#공기청정기", "#필립스"],
  },
  {
    name: "삼성 갤럭시 S24",
    price: 1100000,
    description: "삼성 갤럭시 S24 울트라입니다. 카메라 성능이 압도적입니다.",
    tags: ["#스마트폰", "#삼성"],
  },
  {
    name: "아이폰 15 프로",
    price: 1550000,
    description:
      "애플 아이폰 15 프로 맥스입니다. 티타늄 소재로 가볍고 견고합니다.",
    tags: ["#스마트폰", "#애플"],
  },
  {
    name: "샤오미 로봇청소기",
    price: 400000,
    description:
      "샤오미 로봇청소기 S10입니다. 자동으로 청소하고 충전까지 합니다.",
    tags: ["#로봇청소기", "#샤오미"],
  },
];

const articles = Array.from({ length: 20 }, () => {
  const createdAt = faker.date.between({
    from: "2024-01-01",
    to: new Date(),
  });

  return {
    id: faker.string.nanoid(),
    title: faker.lorem.sentence({ min: 4, max: 10 }),
    content: faker.lorem.paragraphs({ min: 2, max: 5 }, "\n\n"),
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
  };
});

const comments = Array.from({ length: 20 }, () => {
  const createdAt = faker.date.between({
    from: "2024-01-01",
    to: new Date(),
  });
  const randomArticle = faker.helpers.arrayElement(articles);

  return {
    id: faker.string.nanoid(),
    content: faker.lorem.paragraphs({ min: 2, max: 5 }, "\n\n"),
    articleId: randomArticle.id,
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
  };
});

async function seed() {
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  console.log("🧹 기존 데이터 삭제 완료");

  await prisma.product.createMany({
    data: seedData.map((item) => ({
      id: nanoid(),
      ...item,
    })),
  });

  await prisma.article.createMany({ data: articles });
  await prisma.articleComment.createMany({ data: comments });

  console.log(`🌱 시드 데이터 ${seedData.length}개 삽입 완료`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
