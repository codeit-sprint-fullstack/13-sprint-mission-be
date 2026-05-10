import mongoose from "mongoose";
import dotenv from "dotenv";
import product from "./schema/product.js";

dotenv.config();

const seedData = [
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
  {
    name: "1번",
    description: "1번 데이터",
    price: 14900,
    tag: ["1번태그", "2번태그", "3번태그"],
  },
  {
    name: "2번",
    description: "2번 데이터",
    price: 14900,
    tag: ["3번태그", "4번태그", "5번태그"],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ DB 연결 성공");

  // 기존 데이터 전체 삭제 후 새로 삽입
  await product.deleteMany({});
  console.log("🗑️ 기존 데이터 삭제 완료");

  await product.insertMany(seedData);
  console.log(`🌱 시드 데이터 ${seedData.length}개 삽입 완료`);

  await mongoose.disconnect();
  console.log("👋 DB 연결 종료");
}

seed();
