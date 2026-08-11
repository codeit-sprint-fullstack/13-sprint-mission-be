import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { NotFoundError, ValidationError } from "../types/AppError";
import { Prisma } from "@prisma/client";
/// 상품 등록 컨드롤러
export const createProduct = async (
  req: Request<
    {},
    {},
    { name: string; price: number; description: string; tags: string[] }
  >,
  res: Response,
): Promise<void> => {
  const { name, price, description, tags } = req.body;

  if (!name || price == null || !description) {
    throw new ValidationError("name, price, description은 필수입니다");
  }

  const product = await prisma.product.create({
    data: { name, price: Number(price), description, tags },
  });

  res.status(201).json({ success: true, data: product });
};

///전체 조회 컨트롤러
export const getAllProduct = async (
  req: Request<
    {},
    {},
    {},
    { keyword: string; sort: string; page: string; limit: string }
  >,
  res: Response,
): Promise<void> => {
  const { keyword, sort = "latest", page = "1", limit = "10" } = req.query;

  const where: Prisma.ProductWhereInput = {};
  if (keyword) {
    where.OR = [
      { name: { contains: keyword } },
      { description: { contains: keyword } },
    ];
  }

  const orderByMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
    latest: { createdAt: "desc" },
    oldest: { createdAt: "asc" },
    name: { name: "asc" },
  };
  const orderBy = orderByMap[sort] || { createdAt: "desc" };

  const pageNum = Number(page) || 1;
  const take = Number(limit) || 10;
  const skip = (pageNum - 1) * take;

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take }),
    prisma.product.count({ where }),
  ]);
  res.json({
    success: true,
    data: products,
    pagination: {
      page: pageNum,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  });
};

///상품 상세 조회
export const getProduct = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });

  if (!product) {
    throw new NotFoundError("상품을 찾을 수 없습니다");
  }

  res.json({
    success: true,
    data: {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      createdAt: product.createdAt,
    },
  });
};

///상품 수정 컨트롤러
export const updateProduct = async (
  req: Request<
    { id: string },
    {},
    { name: string; price: number; description: string; tags: string[] }
  >,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, tags, price } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: Number(price),
        description,
        tags,
      },
    });
    res.json({ success: true, data: product });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("상품을 찾을 수 없습니다");
    }
    throw error;
  }
};

///상품 삭제 컨트롤러
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true, message: "상품이 삭제되었습니다" });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("상품을 찾을 수 없습니다");
    }
    throw error;
  }
};
