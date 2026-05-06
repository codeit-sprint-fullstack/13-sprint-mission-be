import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "상품명은 필수 항목입니다."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "상품 소개는 필수 항목입니다."],
    },
    price: {
      type: Number,
      required: [true, "판매 가격은 필수 항목입니다."],
      min: [0, "가격은 0원 이상이어야 합니다."],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    // createdAt, updatedAt
    timestamps: true,
  },
);

ProductSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ProductSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Product", ProductSchema);
