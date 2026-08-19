import { Prisma } from "@prisma/client";
import HttpError from "../errors/HttpError.js";
import productRepository, {
  ProductUpdateData,
} from "../repositories/productRepository.js";
import { ListQuery } from "../schemas/querySchema.js";

async function getAll(
  userId: number | undefined,
  { page, pageSize, limit, orderBy, keyword }: ListQuery,
) {
  const take = limit || pageSize;
  const skip = limit ? 0 : (page - 1) * take;
  const orderByClause: Prisma.ProductOrderByWithRelationInput =
    orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

  const { products, totalCount } = await productRepository.getAll(userId, {
    skip,
    take,
    orderBy: orderByClause,
    keyword,
  });

  const list = products.map(({ likes, user, ...rest }) => ({
    ...rest,
    isLiked: likes.length > 0,
    ownerNickname: user?.nickName ?? null,
  }));

  return { list, totalCount };
}

async function getById(id: number, userId?: number) {
  const product = await productRepository.getById(id, userId);
  if (!product) {
    throw new HttpError("상품을 찾을 수 없습니다.", 404);
  }

  const { likes, user, ...rest } = product;
  return {
    ...rest,
    isLiked: likes.length > 0,
    ownerNickname: user?.nickName ?? null,
  };
}

async function create(product: Prisma.ProductUncheckedCreateInput) {
  return productRepository.save(product);
}

async function update(product: ProductUpdateData) {
  return productRepository.update(product);
}

async function deleteById(id: number) {
  return productRepository.deleteById(id);
}

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
