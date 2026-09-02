import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

const create = (data: {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  images: string[];
  authorId: number;
}) => {
  return prisma.product.create({ data });
};

const findById = (id: number) => {
  return prisma.product.findUnique({ where: { id } });
};

const update = (
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
    images: string[];
  },
) => {
  return prisma.product.update({ where: { id }, data });
};

const deleteById = (id: number) => {
  return prisma.product.delete({ where: { id } });
};

const findMany = (params: {
  where: Prisma.ProductWhereInput;
  orderBy: Prisma.ProductOrderByWithRelationInput;
  skip: number;
  take: number;
}) => {
  return prisma.product.findMany(params);
};

const count = (where: Prisma.ProductWhereInput) => {
  return prisma.product.count({ where });
};

const findLike = (userId: number, productId: number) => {
  return prisma.like.findUnique({
    where: { userId_productId: { userId, productId } },
  });
};

const likeTransaction = (userId: number, productId: number) => {
  return prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { likeCount: { increment: 1 } },
    }),
    prisma.like.create({ data: { userId, productId } }),
  ]);
};

const unlikeTransaction = (userId: number, productId: number) => {
  return prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { likeCount: { decrement: 1 } },
    }),
    prisma.like.delete({
      where: { userId_productId: { userId, productId } },
    }),
  ]);
};

export default {
  create,
  findById,
  update,
  deleteById,
  findMany,
  count,
  findLike,
  likeTransaction,
  unlikeTransaction,
};
