import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

interface ListOptions {
  skip?: number;
  take?: number;
  orderBy?: Prisma.ProductOrderByWithRelationInput;
  keyword?: string;
}

export type ProductUpdateData = Omit<
  Partial<Prisma.ProductUncheckedCreateInput>,
  "id"
> & { id: number };

async function getAll(
  userId?: number,
  { skip, take, orderBy, keyword }: ListOptions = {},
) {
  const where: Prisma.ProductWhereInput = keyword
    ? { name: { contains: keyword, mode: "insensitive" } }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        likes: { where: { userId: userId ?? -1 } },
        user: { select: { id: true, nickName: true, image: true } },
      },
      orderBy,
      skip,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, totalCount };
}

async function getById(id: number, userId?: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      comments: true,
      likes: { where: { userId: userId ?? -1 } },
      user: { select: { id: true, nickName: true, image: true } },
    },
  });
  return product;
}

async function save(product: Prisma.ProductUncheckedCreateInput) {
  const createProduct = await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      favoriteCount: product.favoriteCount,
      price: product.price,
      tags: product.tags,
      images: product.images,
      ownerId: product.ownerId,
    },
  });
  return createProduct;
}

async function update(product: ProductUpdateData) {
  const updateProduct = await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      name: product.name,
      description: product.description,
      favoriteCount: product.favoriteCount,
      price: product.price,
      tags: product.tags,
      images: product.images,
    },
  });
  return updateProduct;
}

async function deleteById(id: number) {
  const deleteProduct = await prisma.product.delete({
    where: {
      id,
    },
  });
  return deleteProduct;
}

export default {
  getAll,
  getById,
  save,
  update,
  deleteById,
};
