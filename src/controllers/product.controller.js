import prisma from "../lib/prisma.js";
import createProductSchema, {
  updateProductSchema,
} from "../schemas/product.schema.js";
import asyncHandler from "../utils/asyncHandler.js";

// 상품 등록
export const createProduct = asyncHandler(async (req, res) => {
  const validated = createProductSchema.parse(req.body);

  const { name, description, price, favoriteCount } = req.body;
  const product = await prisma.product.create({
    data: { validated, name, description, price, favoriteCount },
  });
  res.status(201).json({ success: true, data: product });
});

// 상품 목록 조회
export const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = "recent", search = "" } = req.query;
  // 쿼리 수정: FE에도 반영되어야 함
  // orderBy -> sort
  // keyword -> search
  // pageSize -> limit

  // 검색
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  // 정렬
  const orderBy = {
    recent: { createdAt: "desc" },
    favorite: { favoriteCount: "desc" },
  }[sort] || { createdAt: "desc" };

  // 페이지네이션
  const pageNum = Number(page) || 1;
  const take = Number(limit) || 10;
  const skip = (pageNum - 1) * take;

  // 데이터, 총 갯수
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: { select: { nickname: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    totalCount,
    data: products,
    pagination: {
      page: pageNum,
      limit: take,
      totalCount,
      totalPages: Math.ceil(totalCount / take),
    },
  });
});
// 상품 상세 페이지 조회
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { nickname: true } },
      tags: true,
    },
  });

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "찾을 수 없습니다" });
  }

  res.status(200).json({ success: true, data: product });
});

// 상품 수정
export const updateProduct = asyncHandler(async (req, res) => {
  const validated = updateProductSchema.parse(req.body);

  const { id } = req.params;
  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    select: { validated: true, name: true, description: true, price: true },
    data: req.body,
  });
  res.json({ success: true, data: product });
});

// 상품 삭제
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({
    where: { id: parseInt(id) },
  });
  res.json({ success: true, message: "삭제되었습니다" });
});
