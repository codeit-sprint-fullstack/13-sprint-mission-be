import { nanoid } from "nanoid";
import type { Product } from "@prisma/client";
import prisma from "../../lib/prisma";
import { createError } from "../../utils/httpError";
import { searchByKeyword } from "../../utils/searchHandler";
import productRepository, { type ProductDetail } from "./productRepository";
import type {
  CreateProductInput,
  UpdateProductInput,
  GetProductsQuery,
} from "./product.Schema";
import type { PaginatedResult } from "../../types/common";

const orderMap = {
  oldest: { createdAt: "asc" as const },
  recent: { createdAt: "desc" as const },
};

interface LikeResult {
  id: string;
  favoriteCount: number;
}

const productService = {
  async getProducts({
    page,
    pageSize,
    orderBy,
    keyword,
  }: GetProductsQuery): Promise<PaginatedResult<Product>> {
    const offset = (page - 1) * pageSize;
    const order = orderMap[orderBy] ?? orderMap.recent;

    if (keyword) {
      return searchByKeyword<Product>({
        table: "products",
        fields: ["name", "description"],
        keyword,
        order: orderBy === "oldest" ? "asc" : "desc",
        limit: pageSize,
        offset,
      });
    }

    const [totalCount, list] = await Promise.all([
      productRepository.count(),
      productRepository.findMany({ orderBy: order, skip: offset, take: pageSize }),
    ]);

    return { list, totalCount };
  },

  async getProductById(id: string, userId?: string) {
    const product = await productRepository.findById(id, userId);
    if (!product) throw createError("상품을 찾을 수 없습니다.", 404);
    const { likes, ...rest } = product;
    return { ...rest, isLiked: userId ? (likes?.length ?? 0) > 0 : false };
  },

  async createProduct(userId: string, data: CreateProductInput): Promise<Product> {
    return productRepository.create({ id: nanoid(), userId, ...data });
  },

  async updateProduct(userId: string, id: string, data: UpdateProductInput): Promise<Product> {
    const product = await productRepository.findById(id);
    if (!product) throw createError("상품을 찾을 수 없습니다.", 404);
    if (product.userId !== userId) throw createError("수정 권한이 없습니다.", 403);
    return productRepository.update(id, data);
  },

  async deleteProduct(userId: string, id: string): Promise<Product> {
    const product = await productRepository.findById(id);
    if (!product) throw createError("상품을 찾을 수 없습니다.", 404);
    if (product.userId !== userId) throw createError("삭제 권한이 없습니다.", 403);
    return productRepository.delete(id);
  },

  async likeProduct(userId: string, productId: string): Promise<LikeResult> {
    const product = await productRepository.findById(productId);
    if (!product) throw createError("상품을 찾을 수 없습니다.", 404);

    return prisma.$transaction(async (tx) => {
      await tx.productLike.create({ data: { userId, productId } });
      return tx.product.update({
        where: { id: productId },
        data: { favoriteCount: { increment: 1 } },
        select: { id: true, favoriteCount: true },
      });
    });
  },

  async unlikeProduct(userId: string, productId: string): Promise<LikeResult> {
    return prisma.$transaction(async (tx) => {
      await tx.productLike.delete({
        where: { userId_productId: { userId, productId } },
      });
      return tx.product.update({
        where: { id: productId },
        data: { favoriteCount: { decrement: 1 } },
        select: { id: true, favoriteCount: true },
      });
    });
  },
};

export default productService;
