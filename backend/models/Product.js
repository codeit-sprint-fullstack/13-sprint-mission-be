//모델: 스키마 정의

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// 스키마(데이터 구조) 정의
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "상품명은 필수예요"],
      trim: true, // 앞뒤 공백 자동 제거
    },
    description: {
      type: String,
      required: [true, "상품 소개는 필수예요"],
      min: [0, "가격은 0 이상이어야 해요."],
    },
    price: {
      type: Number,
      required: [true, "판매가격은 필수예요"],
    },
    tags: {
      type: [String],
      default: [],
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// 스키마를 모델로 만드는 함수 -> .model(모델 이름, 사용할 스키마)
const Product = model("Product", ProductSchema);

module.exports = Product;
