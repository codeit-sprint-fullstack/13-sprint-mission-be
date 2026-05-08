import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name은 필수예요."],
      trim: true,
      maxLength: [10, "10자 이내로 입력해주세요"],
    },
    price: {
      type: Number,
      required: [true, "가격은 필수예요."],
      default: 0,
      min: [0, "가격은 0 이상이어야 해요."],
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        maxLength: [5, "5글자 이내로 입력해주세요!"],
      },
    ],
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
