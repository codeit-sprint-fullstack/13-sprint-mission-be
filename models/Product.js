import mongoose from "mongoose";
import { nanoid } from "nanoid";

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => nanoid(), // UUID 비슷한 랜덤 문자열 자동 생성
      unique: true,
    },
    name: {
      type: String,
      required: [true, "상품명은 필수입니다"],
      trim: true,
      minlength: [1, "상품명은 최소 1자 이상이어야 합니다"],
      maxlength: [10, "상품명은 최대 10자 이내여야 합니다"],
    },
    description: {
      type: String,
      required: [true, "상품 소개는 필수입니다"],
      trim: true,
      minlength: [10, "상품 소개는 최소 10자 이상이어야 합니다"],
      maxlength: [100, "상품 소개는 최대 100자 이내여야 합니다"],
    },
    price: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "숫자로 입력해주세요",
      },
    },
    tags: [
      {
        type: String,
        maxlength: [5, "태그는 최대 5글자 이내여야 합니다"],
      },
    ],
    images: [
      {
        type: String, // 이미지 URL
      },
    ],
    ownerId: {
      type: Number,
      required: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
