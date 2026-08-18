import type { ProductComment, Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import type { UpdateCommentInput } from "./productComment.Schema";

interface FindManyParams {
  productId: string;
  cursor?: string;
  limit: number;
}

export type ProductCommentListItem = Prisma.ProductCommentGetPayload<{
  select: {
    id: true;
    content: true;
    createdAt: true;
    updatedAt: true;
    user: { select: { id: true; nickname: true; image: true } };
  };
}>;

interface CreateProductCommentData {
  id: string;
  content: string;
  productId: string;
  userId: string;
}

const productCommentRepository = {
  findMany({ productId, cursor, limit }: FindManyParams): Promise<ProductCommentListItem[]> {
    return prisma.productComment.findMany({
      where: { productId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, nickname: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });
  },

  findById(id: string): Promise<ProductComment | null> {
    return prisma.productComment.findUnique({ where: { id } });
  },

  create(data: CreateProductCommentData): Promise<ProductComment> {
    return prisma.productComment.create({ data });
  },

  update(id: string, data: UpdateCommentInput): Promise<ProductComment> {
    return prisma.productComment.update({ where: { id }, data });
  },

  delete(id: string): Promise<ProductComment> {
    return prisma.productComment.delete({ where: { id } });
  },
};

export default productCommentRepository;
