import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name은 필수 입력입니다."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "설명은 필수 입력입니다."],
    },

    price: {
      type: Number,
      required: [true, "가격은 필수 입력입니다"],
      min: [0, "0 이상 입력 해주세요"],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성/갱신
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
