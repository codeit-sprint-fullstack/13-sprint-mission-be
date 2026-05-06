// 설치된 앱 불러오기
const mongoose = require("mongoose");

// 스키마(데이터 구조) 정의
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "상품명은 필수예요"],
      trim: true, // 앞뒤 공백 자동 제거
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "가격은 필수예요"],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

// 스키마를 모델로 만드는 함수 -> .model(모델 이름, 사용할 스키마)
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
