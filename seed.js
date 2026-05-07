import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const randomProducts = () => {
  const products = [];

  for (let i = 1; i <= 50; i++) {
    products.push({
      name: ` ${i}진태`,
      description: `${i}번 상품 설명입니다`,
      price: Math.floor(Math.random() * 100000) + 1000,
      favoriteCount: Math.floor(Math.random() * 100),
      tags: "전자제품",
    });
  }

  return products;
};
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ DB 연결 성공");
  const products = randomProducts();
  // 기존 데이터 전체 삭제 후 새로 삽입
  await Product.deleteMany({});
  console.log("🗑️ 기존 데이터 삭제 완료");

  await Product.insertMany(products);
  console.log(`🌱 시드 데이터 ${products.length}개 삽입 완료`);

  await mongoose.disconnect();
  console.log("👋 DB 연결 종료");
}

seed();
