import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "이름 필수"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "설명 필수"],
      trim: true,
    },
    price: {
      type: Number,
      min: [0, "가격은 최소 0원 이상입니다."],
      required: [true, "가격 필수"],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
