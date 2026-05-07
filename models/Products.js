const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "상품명은 필수예요."],
      trim: true, // 앞뒤 공백 자동 제거
    },
    price: {
      type: Number,
      required: [true, "가격은 필수예요."],
      min: [0, "가격은 0 이상이어야 해요."],
    },
    description: {
      type: String,
      required: [true, "상품 설명은 필수예요."],
    },
    tags: {
      type: Array,
      required: [false],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  },
);

// 2. 모델 생성 (실제 DB와 연결되는 객체)
const Products = mongoose.model("Products", productsSchema);

export default Products;
