import type { Product, User } from "@prisma/client";
import type { UserReturnType } from "../types/user.js";
import type {
  ProductRequestType,
  ProductFindAllRequestType,
  ProductReturnType,
} from "../types/product.js";
import productRepository from "../repositories/productRepository.js";
import createError from "../utils/createError.js";
import { Optional } from "@prisma/client/runtime/library";
import { ProductCommentReturnType } from "../types/productComment.js";

const VALID_ORDER_BY = ["recent", "favorite"];

async function getProducts({
  page,
  pageSize,
  orderBy,
  keyword,
  userId,
}: ProductFindAllRequestType): Promise<{
  totalCount: number;
  list: (ProductReturnType & { liked: boolean })[];
}> {
  if (page !== undefined && page < 1)
    throw createError(400, "page는 1 이상이어야 합니다.");
  if (pageSize !== undefined && pageSize < 1)
    throw createError(400, "pageSize는 1 이상이어야 합니다.");
  if (orderBy && !VALID_ORDER_BY.includes(orderBy))
    throw createError(400, "잘못된 정렬 기준입니다.");

  const [products, totalCount] = await Promise.all([
    productRepository.findAll({ page, pageSize, orderBy, keyword, userId }),
    productRepository.countByKeyword(keyword),
  ]);

  return {
    totalCount,
    list: products,
  };
}

async function createProduct(
  data: ProductRequestType,
): Promise<ProductReturnType> {
  const { name, description, price } = data;
  if (!name || !description || !price)
    throw createError(400, "name, description, price는 필수 값입니다.");

  return await productRepository.create(data);
}

async function updateProduct(
  productId: Product["id"],
  userId: User["id"],
  data: Optional<ProductRequestType>,
): Promise<ProductReturnType> {
  const product = await productRepository.findById(productId, userId);
  if (!product) throw createError(404, "상품을 찾을 수 없습니다.");
  const { name, description, price, tags } = data;
  if (!name && !description && !price && !tags)
    throw createError(400, "수정할 값을 하나 이상 입력해야 합니다.");

  return await productRepository.update(productId, data);
}

async function deleteProduct(
  productId: Product["id"],
  userId: User["id"],
): Promise<ProductReturnType> {
  const product = await productRepository.findById(productId, userId);
  if (!product) throw createError(404, "상품을 찾을 수 없습니다.");

  return await productRepository.deleteById(productId);
}

async function getProductDetail(
  productId: Product["id"],
  userId?: User["id"],
): Promise<
  ProductReturnType & {
    liked: boolean;
    user: UserReturnType;
    comments: ProductCommentReturnType[];
  }
> {
  const product = await productRepository.findById(productId, userId);
  if (!product) throw createError(404, "상품을 찾을 수 없습니다.");

  const comments =
    await productRepository.findProductCommentsByProductId(productId);

  return { ...product, comments };
}

const likeProduct = async (
  productId: Product["id"],
  userId: User["id"],
): Promise<{ liked: boolean; favoriteCount: number }> => {
  const existedLike = await productRepository.findLike(productId, userId);

  if (existedLike) {
    return {
      liked: true,
      favoriteCount: (await productRepository.findById(productId, userId))
        .favoriteCount,
    };
  }

  const result = await productRepository.like(productId, userId);

  return {
    liked: true,
    favoriteCount: result.favoriteCount,
  };
};

const unlikeProduct = async (
  productId: Product["id"],
  userId: User["id"],
): Promise<{ liked: boolean; favoriteCount: number }> => {
  const existedLike = await productRepository.findLike(productId, userId);

  if (!existedLike) {
    const product = await productRepository.findById(productId, userId);
    return {
      liked: false,
      favoriteCount: product.favoriteCount,
    };
  }

  const result = await productRepository.unlike(productId, userId);

  return {
    liked: false,
    favoriteCount: result.favoriteCount,
  };
};

export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  likeProduct,
  unlikeProduct,
};
