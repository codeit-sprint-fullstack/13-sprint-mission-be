import mongoose from "mongoose";

// 1. 스키마 정의 (데이터 구조 설계도)
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "제품 이름은 필수예요."],
      trim: true, // 앞뒤 공백 자동 제거
    },
    price: {
      type: Number,
      required: [true, "가격은 필수예요."],
      min: [0, "가격은 0 이상이어야 해요."],
    },
    description: {
      type: String,
      required: [true, "제품설명은 필수예요."],
    },
    tags: {
      type: String,
      required: [true, "태그는 필수예요."],
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  },
);

// 2. 모델 생성 (실제 DB와 연결되는 객체)
const Product = mongoose.model("product", productSchema);

export default Product;
