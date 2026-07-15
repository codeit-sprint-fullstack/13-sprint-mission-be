import prisma from "../models/prismaClient";

export const productService = {
  createProduct: async (data: {
    ownerId: number;
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
  }) => {
    return await prisma.product.create({ data });
  },

  getProducts: async () => {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, nickname: true } } }, // 작성자 정보도 살짝 포함
    });
  },

  getProductById: async (id: number) => {
    return await prisma.product.findUnique({
      where: { id },
      include: { owner: { select: { id: true, nickname: true } } },
    });
  },

  updateProduct: async (id: number, data: any) => {
    return await prisma.product.update({
      where: { id },
      data,
    });
  },

  deleteProduct: async (id: number) => {
    return await prisma.product.delete({
      where: { id },
    });
  },
};
