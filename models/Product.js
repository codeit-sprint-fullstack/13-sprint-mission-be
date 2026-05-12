import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // id: {
    //   type: String,
    //   minimum: 1,
    //   trim: true,
    // },
    name: {
      type: String,
      minLength: 1,
      maxLength: 20,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
