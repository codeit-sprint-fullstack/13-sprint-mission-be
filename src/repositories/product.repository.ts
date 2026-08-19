import { prisma } from "./prisma.repository";
import type { Prisma } from "@prisma/client";
import type {
  ProductCreateData,
  ProductUpdateData,
  ProductWithRelations,
  SortOrder,
} from "../types/domain";

const include = {
  owner: true,
  likes: true,
} as const;

interface FindAllOptions {
  keyword?: string;
  orderBy?: SortOrder | string;
}

function findAll({ keyword, orderBy }: FindAllOptions = {}): Promise<
  ProductWithRelations[]
> {
  const where: Prisma.ProductWhereInput = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.product.findMany({
    where,
    include,
    orderBy:
      orderBy === "favorite"
        ? { likes: { _count: "desc" } }
        : { createdAt: "desc" },
  });
}

function findById(id: string): Promise<ProductWithRelations | null> {
  return prisma.product.findUnique({ where: { id }, include });
}

function create(data: ProductCreateData): Promise<ProductWithRelations> {
  return prisma.product.create({ data, include });
}

function update(
  id: string,
  data: ProductUpdateData,
): Promise<ProductWithRelations> {
  return prisma.product.update({ where: { id }, data, include });
}

function remove(id: string) {
  return prisma.product.delete({ where: { id } });
}

export { create, findAll, findById, remove, update };
