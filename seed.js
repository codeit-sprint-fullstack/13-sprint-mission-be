import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const seedData = [
  { service: "Netflix", price: 9900, cycle: "monthly" },
  { service: "YouTube Premium", price: 14900, cycle: "monthly" },
  { service: "Spotify", price: 10900, cycle: "monthly" },
  { service: "iCloud 50GB", price: 1100, cycle: "monthly" },
  { service: "Adobe CC", price: 61600, cycle: "yearly" },
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
