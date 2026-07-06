import productRepository from "../repositories/productRepository.js";
import createError from "../utils/createError.js";

const VALID_ORDER_BY = ["recent", "favorite"];

async function getProducts(page, pageSize, orderBy, keyword, userId) {
  if (page && Number(page) < 1)
    throw createError(400, "page는 1 이상이어야 합니다.");
  if (pageSize && Number(pageSize) < 1)
    throw createError(400, "pageSize는 1 이상이어야 합니다.");
  if (orderBy && !VALID_ORDER_BY.includes(orderBy))
    throw createError(400, "잘못된 정렬 기준입니다.");

  const [products, totalCount] = await Promise.all([
    productRepository.findAll(page, pageSize, orderBy, keyword, userId),
    productRepository.countByKeyword(keyword),
  ]);

  return {
    totalCount,
    list: products,
  };
}

async function createProduct(data) {
  const { name, description, price } = data;
  if (!name || !description || !price)
    throw createError(400, "name, description, price는 필수 값입니다.");

  return await productRepository.create(data);
}

async function updateProduct(productId, data) {
  const product = await productRepository.findById(productId);
  if (!product) throw createError(404, "상품을 찾을 수 없습니다.");
  const { name, description, price, tags } = data;
  if (!name && !description && !price && !tags)
    throw createError(400, "수정할 값을 하나 이상 입력해야 합니다.");

  return await productRepository.update(productId, data);
}

async function deleteProduct(productId) {
  const product = await productRepository.findById(productId);
  if (!product) throw createError(404, "상품을 찾을 수 없습니다.");

  return await productRepository.deleteById(productId);
}

async function getProductDetail(productId, userId) {
  const product = await productRepository.findById(productId, userId);
  if (!product) throw createError(404, "상품을 찾을 수 없습니다.");

  const comments =
    await productRepository.findProductCommentsByProductId(productId);

  return { ...product, comments };
}

const likeProduct = async (productId, userId) => {
  const existedLike = await productRepository.findLike(productId, userId);

  if (existedLike) {
    return {
      liked: true,
      favoriteCount: (await productRepository.findById(productId))
        .favoriteCount,
    };
  }

  const result = await productRepository.like(productId, userId);

  return {
    liked: true,
    favoriteCount: result.favoriteCount,
  };
};

const unlikeProduct = async (productId, userId) => {
  const existedLike = await productRepository.findLike(productId, userId);

  if (!existedLike) {
    const product = await productRepository.findById(productId);
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
