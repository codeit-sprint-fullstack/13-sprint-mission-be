// import mongoose from "mongoose"; (refac 미완.... )

// const ProductSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "상품명은 필수 항목입니다."],
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: [true, "상품 소개는 필수 항목입니다."],
//     },
//     price: {
//       type: Number,
//       required: [true, "판매 가격은 필수 항목입니다."],
//       min: [0, "가격은 0원 이상이어야 합니다."],
//     },
//     tags: {
//       type: [String],
//       default: [],
//     },
//   },
//   {
//     // createdAt, updatedAt 쟈둉 생성 갱신
//     timestamps: true,
//   },
// );

// export default mongoose.model("Product", ProductSchema);
