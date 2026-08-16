import type { Request, Response } from "express";
import prisma from "../utils/prisma";
import {
  productIdParamSchema,
  productListQuerySchema,
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidators";
import type { PaginatedResult } from "../types/pagination";
import type { ProductListItem, ProductDetail, ProductWithLikeStatus } from "../types/product";

export async function listProducts(req: Request, res: Response): Promise<void> {
  const { keyword, page = 1, limit = 10, sort = "recent" } =
    productListQuerySchema.parse(req.query);

  // "insensitive"/"desc"는 Prisma가 리터럴 값만 허용해서, 타입 단언(as const)으로
  // 문자열이 아니라 그 리터럴 타입 그대로 유지되도록 고정한다.
  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" as const } },
          { description: { contains: keyword, mode: "insensitive" as const } },
        ],
      }
    : {};

  const orderBy =
    sort === "favorite" ? { favoriteCount: "desc" as const } : { createdAt: "desc" as const };

  const totalCount = await prisma.product.count({ where });
  const list: ProductListItem[] = await prisma.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      favoriteCount: true,
      createdAt: true,
    },
  });

  const result: PaginatedResult<ProductListItem> = { list, totalCount };
  res.status(200).json(result);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const { name, description, price, tags, images } = createProductSchema.parse(req.body);

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags: tags ?? [],
      images: images ?? [],
      userId: req.user!.id,
    },
  });

  res.status(201).json({ product });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const { id } = productIdParamSchema.parse(req.params);

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          userId: true,
          user: { select: { id: true, nickname: true, image: true } },
        },
      },
    },
  });
  if (!product) {
    res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    return;
  }

  let isLiked = false;
  if (req.user) {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_productId: { userId: req.user.id, productId: id } },
    });
    isLiked = Boolean(favorite);
  }

  const result: ProductDetail = { ...product, isLiked };
  res.status(200).json(result);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const { id } = productIdParamSchema.parse(req.params);
  const data = updateProductSchema.parse(req.body);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    return;
  }
  if (product.userId !== req.user!.id) {
    res.status(403).json({ message: "수정 권한이 없습니다." });
    return;
  }

  const updated = await prisma.product.update({ where: { id }, data });
  res.status(200).json({ product: updated });
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = productIdParamSchema.parse(req.params);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    return;
  }
  if (product.userId !== req.user!.id) {
    res.status(403).json({ message: "삭제 권한이 없습니다." });
    return;
  }

  await prisma.product.delete({ where: { id } });
  res.status(204).send();
}

export async function favoriteProduct(req: Request, res: Response): Promise<void> {
  const { id } = productIdParamSchema.parse(req.params);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    return;
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: req.user!.id, productId: id } },
  });
  if (existing) {
    res.status(400).json({ message: "이미 좋아요한 상품입니다." });
    return;
  }

  const [, updated] = await prisma.$transaction([
    prisma.favorite.create({ data: { userId: req.user!.id, productId: id } }),
    prisma.product.update({
      where: { id },
      data: { favoriteCount: { increment: 1 } },
    }),
  ]);

  const result: ProductWithLikeStatus = { ...updated, isLiked: true };
  res.status(200).json(result);
}

export async function unfavoriteProduct(req: Request, res: Response): Promise<void> {
  const { id } = productIdParamSchema.parse(req.params);

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: req.user!.id, productId: id } },
  });
  if (!existing) {
    res.status(400).json({ message: "좋아요하지 않은 상품입니다." });
    return;
  }

  const [, updated] = await prisma.$transaction([
    prisma.favorite.delete({
      where: { userId_productId: { userId: req.user!.id, productId: id } },
    }),
    prisma.product.update({
      where: { id },
      data: { favoriteCount: { decrement: 1 } },
    }),
  ]);

  const result: ProductWithLikeStatus = { ...updated, isLiked: false };
  res.status(200).json(result);
}
