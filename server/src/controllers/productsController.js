const prisma = require("../utils/prisma");
const asyncHandler = require("../middlewares/asyncHandler");

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, tags } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,

      // 변경: tags는 DB에 문자열로 저장했습니다.
      // 프론트에서 배열로 오면 "태그1,태그2" 형태로 바꿔서 저장합니다.
      tags: Array.isArray(tags) ? tags.join(",") : "",
    },
  });

  res.status(201).json(product);
});

const listProducts = asyncHandler(async (req, res) => {
  const offset = req.query.offset || 0;
  const limit = req.query.limit || 10;
  const keyword = req.query.keyword || "";

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const total = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
  });

  res.status(200).json({
    data: products,
    pagination: {
      total,
      offset,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      imageUrl: true,
      createdAt: true,
    },
  });

  if (!product) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }

  // 변경: DB에는 tags가 문자열로 저장되어 있어서
  // 화면에서 쓰기 쉽게 배열로 바꿔서 보내줍니다.
  const result = {
    ...product,
    tags: product.tags ? product.tags.split(",") : [],
  };

  res.status(200).json(result);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, tags } = req.body;

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),

      // 변경: tags가 들어온 경우에만 수정합니다.
      // 배열이면 문자열로 바꿔서 저장합니다.
      ...(tags !== undefined && {
        tags: Array.isArray(tags) ? tags.join(",") : tags,
      }),
    },
  });

  // 변경: 수정 후 응답도 프론트에서 쓰기 편하게 배열로 바꿉니다.
  const result = {
    ...product,
    tags: product.tags ? product.tags.split(",") : [],
  };

  res.status(200).json(result);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await prisma.product.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
});

module.exports = {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
