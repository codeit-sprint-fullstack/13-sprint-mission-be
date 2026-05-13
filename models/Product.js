import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "제품의 이름은 필수입니다."],
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      require: [true, "가격은 필수 입니다."],
      min: [0, "가격은 0 이상이어야 합니다."],
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

export default mongoose.model("Product", productSchema);
