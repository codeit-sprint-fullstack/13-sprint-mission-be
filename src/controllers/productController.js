import { asyncHandler } from "../utils/asycHandler.js";
import prisma, { Prisma } from "../lib/prisma.js";
import { success } from "zod";
import { nanoid } from "nanoid";
import { skip } from "@prisma/client/runtime/library";
import { NotFoundError } from "../utils/errors.js";
import { searchByKeyword } from "../utils/searchHandler.js";

//상품 등록
export const createProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.create({
    data: {
      id: nanoid(),
      ...req.validatedData,
    },
  });
  res.status(201).json({ success: true, data: product });
});

//상품 목록 조회
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    orderBy = "recent",
    keyword = "",
  } = req.query;

  const offset = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  const order =
    orderBy === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

  if (keyword) {
    const { list, totalCount } = await searchByKeyword({
      table: "products",
      fields: ["name", "description"],
      keyword,
      order,
      limit,
      offset,
    });

    return res.status(200).json({
      list,
      totalCount,
    });
  }

  const [totalCount, list] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({
      orderBy: order,
      skip: offset,
      take: limit,
    }),
  ]);

  res.status(200).json({ list, totalCount });
});

//상품 상세 조회
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) throw new NotFoundError("상품 아이디를 찾을 수 없습니다.");

  res.json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.update({
    where: { id },
    data: req.validatedData,
  });

  if (!product)
    throw new NotFoundError({ message: "존재하지 않는 ID 입니다." });

  res.json(product);
});

//상품 삭제
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.delete({ where: { id } });

  if (!product) throw new NotFoundError("존재하지 않는 상품 입니다.");

  res.status(204).send();
});
