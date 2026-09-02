import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, User } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const seedUsers = [
  {
    email: "seller1@example.com",
    nickname: "판다상인",
    password: "password123!",
  },
  {
    email: "seller2@example.com",
    nickname: "중고왕",
    password: "password123!",
  },
];

const productData = [
  {
    name: "아이폰 13 미니 128GB",
    description:
      "사용감 적은 아이폰 13 미니 128GB 판매합니다. 배터리 성능 89%입니다.",
    price: 650000,
    tags: ["애플", "스마트폰", "아이폰"],
    images: ["https://picsum.photos/seed/product1-1/400/300"],
    likeCount: 45,
  },
  {
    name: "나이키 에어포스1 화이트",
    description: "몇 번 안 신은 나이키 에어포스1 화이트 250mm 판매해요.",
    price: 89000,
    tags: ["나이키", "운동화", "신발"],
    images: ["https://picsum.photos/seed/product2-1/400/300"],
    likeCount: 38,
  },
  {
    name: "삼성 갤럭시 버즈2 프로",
    description: "거의 새 제품 갤럭시 버즈2 프로 판매합니다. 박스 포함.",
    price: 120000,
    tags: ["삼성", "이어폰", "버즈"],
    images: ["https://picsum.photos/seed/product3-1/400/300"],
    likeCount: 32,
  },
  {
    name: "이케아 원목 책상",
    description: "이사로 인해 이케아 원목 책상 판매합니다. 상태 좋습니다.",
    price: 45000,
    tags: ["이케아", "가구", "책상"],
    images: ["https://picsum.photos/seed/product4-1/400/300"],
    likeCount: 27,
  },
  {
    name: "다이슨 무선청소기 V8",
    description: "다이슨 V8 무선청소기 판매합니다. 흡입력 좋아요.",
    price: 280000,
    tags: ["다이슨", "청소기", "가전"],
    images: ["https://picsum.photos/seed/product5-1/400/300"],
    likeCount: 24,
  },
  {
    name: "닌텐도 스위치 라이트",
    description: "닌텐도 스위치 라이트 옐로우 판매합니다. 구성품 모두 있어요.",
    price: 150000,
    tags: ["닌텐도", "게임기", "스위치"],
    images: ["https://picsum.photos/seed/product6-1/400/300"],
    likeCount: 20,
  },
  {
    name: "코닥 필름카메라 M35",
    description: "감성 필름카메라 코닥 M35 판매합니다. 미개봉 새제품.",
    price: 25000,
    tags: ["카메라", "필름카메라", "코닥"],
    images: ["https://picsum.photos/seed/product7-1/400/300"],
    likeCount: 18,
  },
  {
    name: "무인양품 디퓨저 세트",
    description: "무인양품 디퓨저 세트 판매합니다. 향 좋아요.",
    price: 18000,
    tags: ["무인양품", "디퓨저", "인테리어"],
    images: ["https://picsum.photos/seed/product8-1/400/300"],
    likeCount: 15,
  },
  {
    name: "루이비통 반지갑",
    description: "정품 구매한 루이비통 반지갑 판매합니다. 영수증 있습니다.",
    price: 380000,
    tags: ["루이비통", "지갑", "명품"],
    images: ["https://picsum.photos/seed/product9-1/400/300"],
    likeCount: 12,
  },
  {
    name: "캠핑 2인용 텐트",
    description: "몇 번 사용한 2인용 캠핑 텐트 판매합니다. 상태 양호합니다.",
    price: 95000,
    tags: ["캠핑", "텐트", "아웃도어"],
    images: ["https://picsum.photos/seed/product10-1/400/300"],
    likeCount: 10,
  },
  {
    name: "에어팟 프로 2세대",
    description: "에어팟 프로 2세대 판매합니다. 케이스 포함 상태 좋아요.",
    price: 195000,
    tags: ["애플", "에어팟", "이어폰"],
    images: ["https://picsum.photos/seed/product11-1/400/300"],
    likeCount: 8,
  },
  {
    name: "리바이스 청자켓",
    description: "리바이스 데님 자켓 M사이즈 판매합니다.",
    price: 42000,
    tags: ["리바이스", "청자켓", "의류"],
    images: ["https://picsum.photos/seed/product12-1/400/300"],
    likeCount: 6,
  },
  {
    name: "스타벅스 텀블러 새제품",
    description: "미개봉 스타벅스 텀블러 판매합니다. 선물용으로 좋아요.",
    price: 15000,
    tags: ["스타벅스", "텀블러", "선물"],
    images: ["https://picsum.photos/seed/product13-1/400/300"],
    likeCount: 4,
  },
  {
    name: "육아용 아기띠",
    description: "몇 번 사용하지 않은 아기띠 판매합니다. 세탁 완료했어요.",
    price: 30000,
    tags: ["육아", "아기띠", "유아용품"],
    images: ["https://picsum.photos/seed/product14-1/400/300"],
    likeCount: 2,
  },
  {
    name: "중고 골프채 풀세트",
    description: "중고 골프채 풀세트 판매합니다. 초보자용으로 좋아요.",
    price: 220000,
    tags: ["골프", "골프채", "스포츠"],
    images: ["https://picsum.photos/seed/product15-1/400/300"],
    likeCount: 0,
  },
];

async function main() {
  const users: User[] = [];
  for (const seedUser of seedUsers) {
    const encryptedPassword = await bcrypt.hash(seedUser.password, 10);
    const user = await prisma.user.upsert({
      where: { email: seedUser.email },
      update: {},
      create: {
        email: seedUser.email,
        nickname: seedUser.nickname,
        encryptedPassword,
      },
    });
    users.push(user);
  }

  await prisma.product.createMany({
    data: productData.map((product, index) => ({
      ...product,
      authorId: users[index % users.length].id,
    })),
  });

  console.log(
    `시드 완료: 유저 ${users.length}명, 상품 ${productData.length}개 생성`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
