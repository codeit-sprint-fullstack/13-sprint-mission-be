// product.controller.js
import prisma from "../config/prisma.js";
import { NotFoundError } from "../middlewares/errorHandler.js";

// [ ]  상품 상세 조회 API를 만들어 주세요.
// [ ] id, name, description, price, tags, createdAt를 조회합니다.
export const getProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
    },
  });
  if (!product) throw new NotFoundError("Product을 찾을 수 없습니다");
  res.json({ sucess: true, data: product });
};

//[ ]  상품 등록 API를 만들어 주세요.
// [ ] name, description, price, tags를 입력하여 상품을 등록합니다.
export const createProduct = async (req, res) => {
  const product = await prisma.product.create({
    data: req.validatedData,
  });
  res.status(201).json({ success: true, data: product });
};

// [ ]  상품 수정 API를 만들어 주세요.
// [ ] PATCH 메서드를 사용해 주세요.
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await prisma.product.update({
    where: { id: parseInt(productId) },
    data: req.validatedData,
  });
  res.json({ success: true, data: product });
};

// [ ]  상품 삭제 API를 만들어 주세요.
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  await prisma.product.delete({
    where: { id: parseInt(productId) },
  });
  res.json({ success: true, message: "Product이 삭제되었습니다" });
};

// [ ]  상품 목록 조회 API를 만들어 주세요.
// [ ] id, name, price, createdAt를 조회합니다.
// [ ] offset 방식의 페이지네이션 기능을 포함해 주세요.
// [ ] 최신순(recent)으로 정렬할 수 있습니다.
// [ ] name, description에 포함된 단어로 검색할 수 있습니다.
export const getProducts = async (req, res) => {
  const { search, sort = "recent", page = "1", limit = "10" } = req.query;

  const where = {};

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const orderBy =
    sort === "recent" ? { createdAt: "desc" } : { createdAt: "asc" };

  const pageNum = Math.max(1, parseInt(page) || 1);
  const take = Math.max(1, parseInt(limit) || 10);
  const skip = (pageNum - 1) * take;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  res.json({
    success: true,
    page: pageNum,
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
    data: products,
  });
};
