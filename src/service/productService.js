import { nanoid } from "nanoid";
import prisma from "#/lib/prisma.js";
import { createError } from "#/utils/httpError.js";
import { searchByKeyword } from "#/utils/searchHandler.js";
import productRepository from "#/repository/productRepository.js";

const orderMap = {
  oldest: { createdAt: "asc" },
  recent: { createdAt: "desc" },
};

const productService = {
  async getProducts({ page, pageSize, orderBy, keyword }) {
    const offset = (page - 1) * pageSize;
    const order = orderMap[orderBy] ?? orderMap.recent;

    if (keyword) {
      return searchByKeyword({
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

  async getProductById(id, userId) {
    const product = await productRepository.findById(id, userId);
    if (!product) throw createError("상품을 찾을 수 없습니다.", 404);
    const { likes, ...rest } = product;
    return { ...rest, isLiked: userId ? (likes?.length ?? 0) > 0 : false };
  },

  async createProduct(userId, data) {
    return productRepository.create({ id: nanoid(), userId, ...data });
  },

  async updateProduct(userId, id, data) {
    const product = await productRepository.findById(id);
    if (!product) throw createError("상품을 찾을 수 없습니다.", 404);
    if (product.userId !== userId) throw createError("수정 권한이 없습니다.", 403);
    return productRepository.update(id, data);
  },

  async deleteProduct(userId, id) {
    const product = await productRepository.findById(id);
    if (!product) throw createError("상품을 찾을 수 없습니다.", 404);
    if (product.userId !== userId) throw createError("삭제 권한이 없습니다.", 403);
    return productRepository.delete(id);
  },

  async likeProduct(userId, productId) {
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

  async unlikeProduct(userId, productId) {
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
