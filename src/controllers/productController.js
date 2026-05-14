import { asyncHandler } from "../utils/asycHandler.js";
import prisma, { Prisma } from "../lib/prisma.js";
import { success } from "zod";
import { nanoid } from "nanoid";
import { skip } from "@prisma/client/runtime/library";
import { NotFoundError } from "../utils/errors.js";

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
  const orderDir = orderBy === "oldest" ? Prisma.sql`ASC` : Prisma.sql`DESC`;

  if (keyword) {
    const token = keyword.trim().replace(/\s+/g, ""); // 검색어 공백 제거
    const wsPattern = "\\s+";
    const like = `%${token}%`;

    const whereClause = Prisma.sql`(
    regexp_replace(COALESCE(name, ''), ${wsPattern}, '', 'g') ILIKE ${like}
    OR regexp_replace(COALESCE(description, ''), ${wsPattern}, '', 'g') ILIKE ${like}
  )`;

    const [list, totalCount] = await Promise.all([
      prisma.$queryRaw`
        SELECT * FROM products
        WHERE ${whereClause}
        ORDER BY "createdAt" ${orderDir}
        LIMIT ${limit} OFFSET ${offset}
      `,
      prisma.$queryRaw`
        SELECT COUNT(*)::int AS count FROM products
        WHERE ${whereClause}
      `,
    ]);

    return res.status(200).json({
      list,
      totalCount,
    });
  }

  const order =
    orderBy === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

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

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(400).json({ message: "존재하지 않는 ID 입니다." });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//상품 삭제
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "존재하지 않는 ID 입니다." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
