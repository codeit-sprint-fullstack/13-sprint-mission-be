import prisma from "../utils/prisma.js";
import {
  productIdParamSchema,
  productListQuerySchema,
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidators.js";

export async function listProducts(req, res) {
  const { keyword, page = 1, limit = 10, sort = "recent" } =
    productListQuerySchema.parse(req.query);

  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const orderBy =
    sort === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

  const totalCount = await prisma.product.count({ where });
  const list = await prisma.product.findMany({
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

  res.status(200).json({ list, totalCount });
}

export async function createProduct(req, res) {
  const { name, description, price, tags, images } =
    createProductSchema.parse(req.body);

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags: tags ?? [],
      images: images ?? [],
      userId: req.user.id,
    },
  });

  res.status(201).json({ product });
}

export async function getProduct(req, res) {
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
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }

  let isLiked = false;
  if (req.user) {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_productId: { userId: req.user.id, productId: id } },
    });
    isLiked = Boolean(favorite);
  }

  res.status(200).json({ ...product, isLiked });
}

export async function updateProduct(req, res) {
  const { id } = productIdParamSchema.parse(req.params);
  const data = updateProductSchema.parse(req.body);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }
  if (product.userId !== req.user.id) {
    return res.status(403).json({ message: "수정 권한이 없습니다." });
  }

  const updated = await prisma.product.update({ where: { id }, data });
  res.status(200).json({ product: updated });
}

export async function deleteProduct(req, res) {
  const { id } = productIdParamSchema.parse(req.params);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }
  if (product.userId !== req.user.id) {
    return res.status(403).json({ message: "삭제 권한이 없습니다." });
  }

  await prisma.product.delete({ where: { id } });
  res.status(204).send();
}

export async function favoriteProduct(req, res) {
  const { id } = productIdParamSchema.parse(req.params);

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: req.user.id, productId: id } },
  });
  if (existing) {
    return res.status(400).json({ message: "이미 좋아요한 상품입니다." });
  }

  const [, updated] = await prisma.$transaction([
    prisma.favorite.create({ data: { userId: req.user.id, productId: id } }),
    prisma.product.update({
      where: { id },
      data: { favoriteCount: { increment: 1 } },
    }),
  ]);

  res.status(200).json({ ...updated, isLiked: true });
}

export async function unfavoriteProduct(req, res) {
  const { id } = productIdParamSchema.parse(req.params);

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: req.user.id, productId: id } },
  });
  if (!existing) {
    return res.status(400).json({ message: "좋아요하지 않은 상품입니다." });
  }

  const [, updated] = await prisma.$transaction([
    prisma.favorite.delete({
      where: { userId_productId: { userId: req.user.id, productId: id } },
    }),
    prisma.product.update({
      where: { id },
      data: { favoriteCount: { decrement: 1 } },
    }),
  ]);

  res.status(200).json({ ...updated, isLiked: false });
}
