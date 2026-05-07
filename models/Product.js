import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 10,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      validate: {
        validator: (tags) => tags.every((tag) => tag.length <= 5),
      },
      message: "태그는 5글자 이내여야 합니다",
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
