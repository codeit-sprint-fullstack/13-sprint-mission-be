import dotenv from "dotenv";
import mongoose from "mongoose";

import Product from "./models/Product.js";

dotenv.config();

const seedData = [
  {
    name: "다이슨 청소기",
    price: 2500000,
    favoriteCount: 200,
    tags: ["청소기", "다이슨", "무선청소기"],
    description: "초강력 무선 청소기입니다.",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ DB 연결 성공");

  await Product.deleteMany({});
  console.log("🗑️  기존 데이터 삭제 완료");

  await Product.insertMany(seedData);
  console.log(`🌱 시드 데이터 ${seedData.length}개 삽입 완료`);

  await mongoose.disconnect();
  console.log("👋 DB 연결 종료");
}

seed();
