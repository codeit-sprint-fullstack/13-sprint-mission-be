import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import prisma from "./db.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import {
  createProductSchema,
  updateProductSchema,
} from "./validators/productValidator.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" })); //데이터 요청 5MB로 제한 (서버 부하)

app.get("/", (req, res) => {
  res.json({ message: "서버가 정상적으로 동작 중 입니다!" });
});

// 상품 목록 전체 조회
app.get(
  "/products",
  asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany();

    res.json({
      list: products,
      totalCount: products.length,
    });
  }),
);

// 단일 상품 조회
app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    // 존재하지 않는 상품의 id 조회 시 에러 처리
    if (!product) {
      return res
        .status(404)
        .json({ message: "조회하신 상품을 찾을 수 없어요." });
    }

    res.json({
      list: [product],
      totalCount: 1,
    });
  }),
);

// 상품 등록
app.post(
  "/products",
  asyncHandler(async (req, res) => {
    const validationResult = createProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "상품 등록 실패 : 입력 값 또는 가격을 확인해주세요.",
        errors: validationResult.error.issues.map((err) => err.message),
      });
    }
    const product = await prisma.product.create({
      data: validationResult.data,
    });

    res.status(201).json(product);
  }),
);

app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const validationResult = updateProductSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "상품 수정 실패 : 입력 값 또는 가격을 확인해주세요.",
        errors: validationResult.error.issues.map((err) => err.message),
      });
    }

    if (Object.keys(validationResult.data).length === 0) {
      return res.status(400).json({ message: "수정할 값을 입력해주세요." });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "해당 상품을 찾을 수 없어요." });
    }

    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: validationResult.data,
    });

    res.json(product);
  }),
);

// 상품 삭제
app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "해당 상품을 찾을 수 없어요." });
    }

    const deletedProduct = await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "정상적으로 삭제 처리됐습니다!",
      data: deletedProduct,
    });
  }),
);

// 서버 헬스쳌 라우터
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버는  http://localhost:${PORT} 에서 동작 중 입니다!`);
});
