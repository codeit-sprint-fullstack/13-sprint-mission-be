import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // 방금 만든 스키마

dotenv.config();

const seedProducts = [
  {
    name: "대한민국 유니폼",
    description: "남성 나이키 드라이 핏 축구 레플리카 저지",
    price: 135000,
    tags: ["축구 ", "유니폼"],
    images: [
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/2aa15d75-ec40-4907-ac7e-370870dd8f0a/AS+KOR+M+NK+DF+JSY+SS+STAD+HM.png",
    ],
    ownerId: 1,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB 연결 성공");

    // 기존 데이터 삭제
    await Product.deleteMany({});
    console.log("🗑️ 기존 Product 데이터 삭제 완료");

    // 새 데이터 삽입
    await Product.insertMany(seedProducts);
    console.log("🌱 Seed 데이터 삽입 완료");

    mongoose.connection.close();
    console.log("🔌 연결 종료");
  } catch (err) {
    console.error("❌ Seed 작업 실패:", err);
  }
};

seedDB();
