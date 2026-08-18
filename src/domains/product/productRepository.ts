import type { Product, Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import type { CreateProductInput, UpdateProductInput } from "./product.Schema";

interface FindManyParams {
  orderBy: Prisma.ProductOrderByWithRelationInput;
  skip: number;
  take: number;
}

export type ProductDetail = Prisma.ProductGetPayload<{
  include: {
    user: { select: { id: true; nickname: true; image: true } };
    comments: {
      select: {
        id: true;
        content: true;
        createdAt: true;
        updatedAt: true;
        user: { select: { id: true; nickname: true; image: true } };
      };
      orderBy: { createdAt: "desc" };
    };
    likes: { where: { userId: string }; select: { userId: true } };
  };
}>;

type CreateProductData = CreateProductInput & { id: string; userId: string };

const productRepository = {
  findMany({ orderBy, skip, take }: FindManyParams): Promise<Product[]> {
    return prisma.product.findMany({ orderBy, skip, take });
  },

  count(): Promise<number> {
    return prisma.product.count();
  },

  findById(id: string, userId?: string): Promise<ProductDetail | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: { select: { id: true, nickname: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        likes: { where: { userId: userId ?? "" }, select: { userId: true } },
      },
    });
  },

  create(data: CreateProductData): Promise<Product> {
    return prisma.product.create({ data });
  },

  update(id: string, data: UpdateProductInput): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  },

  delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  },
};

export default productRepository;
