import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./db.js";

dotenv.config();

const seedData = [
  { name: "권태현", description: "남자", price: 100, tags: ["a"] },
];
async function seed() {
  try {
    await connectDB();

    console.log("MongoDB 연결 성공");

    await Product.deleteMany({});
    console.log("기존 데이터 삭제");

    await Product.insertMany(seedData);
    console.log("데이터 삽입 완료");

    await mongoose.disconnect();

    console.log("종료");
  } catch (error) {
    console.error(error);
  }
}

seed();
