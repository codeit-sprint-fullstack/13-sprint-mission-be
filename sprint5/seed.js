import mongoose from "mongoose";
import dotenv from "dotenv";

import Product from "./models/Product.js";

dotenv.config();

const seedData = [
  {
    name: "MacbookNeo",
    description: "새로 나온 맥북 신상 저렴하게 내놓습니다.",
    price: 890000,
    tags: ["애플", "전자기기", "노트북"],
  },

  {
    name: "Lofree Flow 2",
    description: "유무선 기계식 스페이스그레이 (Pulse축,84키), 소리가 좋아요.",
    price: 189000,
    tags: ["키보드", "전자기기", "데스크테리어"],
  },

  {
    name: "로지텍 MX Master3 무선 마우스",
    description: "잘 사용하다가 아무래도 오버스펙이라 판매 합니다.",
    price: 78000,
    tags: ["마우스", "전자기기", "로지텍"],
  },

  {
    name: "치이카와 피규어",
    description: "먼작귀 랜덤 피규어 모은거 팝니다.",
    price: 20000,
    tags: ["피규어", "랜덤", "먼작귀"],
  },

  {
    name: "닌텐도스위치 oled",
    description: "닌텐도스위치 2 모델 구입으로 인해 판매합니다.",
    price: 290000,
    tags: ["애플", "전자기기", "노트북"],
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
