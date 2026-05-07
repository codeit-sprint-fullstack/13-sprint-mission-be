import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const seedData = [
  {
    name: "넷플릭스",
    description: "넷플릭스테스트열글자",
    price: 50000,
    tags: ["테스트", "테스트2"],
  },
  {
    name: "유튜브",
    description: "유튜브열글자넘어야해요",
    price: 20000,
    tags: ["테스트", "테스트2"],
  },
  {
    name: "인스타그램",
    description: "인스타그램이건몇글자일까",
    price: 70000,
    tags: ["테스트", "테스트2"],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ DB 연결 성공");

  // 기존 데이터 전체 삭제 후 새로 삽입
  await Product.deleteMany({});
  console.log("🗑️ 기존 데이터 삭제 완료");

  await Product.insertMany(seedData);
  console.log(`🌱 시드 데이터 ${seedData.length}개 삽입 완료`);

  await mongoose.disconnect();
  console.log("👋 DB 연결 종료");
}

seed();
