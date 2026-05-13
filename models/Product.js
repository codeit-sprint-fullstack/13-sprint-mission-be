import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "상품명은 필수예요."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "상품소개는 필수예요."],
    },
    price: {
      type: Number,
      required: [true, "판매가격은 필수예요."],
      min: [0, "가격은 0 이상이어야 해요."],
    },
    tags: [String],

    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성/갱신
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
