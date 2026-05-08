import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import Product from "./models/Product.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { keywordFilter, productSort, getPagination } from "./utils/findBy.js";

dotenv.config(); // .env 파일 로드 (맨 먼저!)

const app = express();
// 개발할 때 (모든 도메인 허용 - 개발 편의상)
// app.use(cors());

// 배포할 때 (특정 도메인만 허용 - 보안상 좋음)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // 개발용 프론트엔드
      "sprint-mission-fe-5.vercel.app", // 배포된 프론트엔드
    ],
  }),
);
app.use(express.json());

// DB 연결
connectDB();

//[ ]  상품 등록 API를 만들어 주세요.
// [ ] name, description, price, tags를 입력하여 상품을 등록합니다.
app.post(
  "/product",
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  }),
);

// [ ]  상품 상세 조회 API를 만들어 주세요.
// [ ] id, name, description, price, tags, createdAt를 조회합니다.
app.get(
  "/product/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
      .select("id name description price tags createdAt")
      .exec();
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
    res.json(product); // 브라우저에 던지는
  }),
);

// [ ]  상품 수정 API를 만들어 주세요.
// [ ] PATCH 메서드를 사용해 주세요.
app.patch(
  "/product/:id",
  asyncHandler(async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "할 일을 찾을 수 없어요." });
    }
    res.json(updated);
  }),
);

// [ ]  상품 삭제 API를 만들어 주세요.
app.delete(
  "/product/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "할 일을 찾을 수 없어요." });
    }
    res.json({ message: "삭제되었어요.", data: deleted });
  }),
);

// [ ]  상품 목록 조회 API를 만들어 주세요.
// [ ] id, name, price, createdAt를 조회합니다.
// [ ] offset 방식의 페이지네이션 기능을 포함해 주세요.
// [ ] 최신순(recent)으로 정렬할 수 있습니다.
// [ ] name, description에 포함된 단어로 검색할 수 있습니다.
app.get(
  "/product",
  asyncHandler(async (req, res) => {
    const { keyword, offset, limit, sort = "recent" } = req.query;
    const filtered = keywordFilter(keyword);
    const sortOption = productSort(sort);
    const { offsetNum, limitNum } = getPagination(offset, limit);
    const products = await Product.find(filtered)
      .sort(sortOption)
      .skip(offsetNum)
      .limit(limitNum)
      .select("id name price createdAt")
      .exec();

    const total = await Product.countDocuments(filtered);
    res.json({
      data: products,
      pagination: {
        offset: offsetNum,
        limit: limitNum,
        total,
        hasMore: offsetNum + limitNum < total,
      },
    });
  }),
);

// [ ]  각 API에 적절한 에러 처리를 해 주세요.
// [ ]  각 API 응답에 적절한 상태 코드를 리턴하도록 해 주세요.

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중이에요! 🚀`);
});
