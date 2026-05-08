import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import connectDB from "./db.js";
import Product from "./models/Product.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

connectDB();

// ✅ 기본 엔드포인트에서 상품 목록 반환
app.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json({
      list: products,
      totalCount: products.length,
    });
  }),
);

// ✅ 전체 상품 조회 (list + totalCount)
app.get(
  "/products",
  asyncHandler(async (req, res) => {
    console.log("GET /products 요청받음!");
    const filter = {};

    if (
      req.query.name &&
      req.query.name.length >= 1 &&
      req.query.name.length <= 10
    ) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }
    if (
      req.query.description &&
      req.query.description.length >= 10 &&
      req.query.description.length <= 100
    ) {
      filter.description = { $regex: req.query.description, $options: "i" };
    }
    if (req.query.price && !isNaN(req.query.price)) {
      filter.price = Number(req.query.price);
    }
    if (req.query.tag && req.query.tag.length <= 5) {
      filter.tags = req.query.tag;
    }

    const products = await Product.find(filter);
    res.json({
      list: products,
      totalCount: products.length,
    });
  }),
);

// ✅ 단일 상품 조회 (커스텀 id 기준)
app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없어요." });
    }
    res.json({
      list: [product],
      totalCount: 1,
    });
  }),
);

// ✅ 상품 생성
app.post(
  "/products",
  asyncHandler(async (req, res) => {
    const body = req.body ?? {};
    const images = Array.isArray(body.images)
      ? body.images
      : body.image
        ? [body.image]
        : [];
    const productData = {
      ...body,
      price: Number(body.price),
      tags: Array.isArray(body.tags) ? body.tags : [],
      images,
      ownerId: body.ownerId ?? 1,
    };
    const { name, description, price, tags } = productData;

    if (!name || name.length < 1 || name.length > 10) {
      return res
        .status(400)
        .json({ message: "상품명은 1자 이상 10자 이내여야 합니다." });
    }
    if (!description || description.length < 10 || description.length > 100) {
      return res
        .status(400)
        .json({ message: "상품 소개는 10자 이상 100자 이내여야 합니다." });
    }
    if (isNaN(price)) {
      return res.status(400).json({ message: "판매 가격은 숫자여야 합니다." });
    }
    if (tags && tags.some((tag) => tag.length > 5)) {
      return res
        .status(400)
        .json({ message: "태그는 각각 5글자 이내여야 합니다." });
    }

    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  }),
);

// ✅ 상품 수정 (커스텀 id 기준)
app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const { name, description, price, tags } = req.body;

    if (name && (name.length < 1 || name.length > 10)) {
      return res
        .status(400)
        .json({ message: "상품명은 1자 이상 10자 이내여야 합니다." });
    }
    if (description && (description.length < 10 || description.length > 100)) {
      return res
        .status(400)
        .json({ message: "상품 소개는 10자 이상 100자 이내여야 합니다." });
    }
    if (price && isNaN(price)) {
      return res.status(400).json({ message: "판매 가격은 숫자여야 합니다." });
    }
    if (tags && tags.some((tag) => tag.length > 5)) {
      return res
        .status(400)
        .json({ message: "태그는 각각 5글자 이내여야 합니다." });
    }

    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true },
    );
    if (!updated) {
      return res.status(404).json({ message: "상품을 찾을 수 없어요." });
    }
    res.json(updated);
  }),
);

// ✅ 상품 삭제 (커스텀 id 기준)
app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "상품을 찾을 수 없어요." });
    }
    res.json({ message: "삭제되었어요.", data: deleted });
  }),
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중이에요! 🚀`);
});
