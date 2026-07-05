// ============================================================
// Product Service
// ============================================================
import productRepository from "../repositories/product.repository.js";
import { AppError } from "../middlewares/errors.js";

/** API 응답 변환 함수
 * - tag 필드만 추출해서 다시 문자열 배열로 */
export const convertToProductResponse = (product) => ({
  ...product,
  tags: product.tags?.map((tagObj) => tagObj.tag),
});

/** 상품 목록 조회 서비스 로직
 * - 검색 / 정렬 / 페이지네이션
 * - userId가 있으면 isLiked 계산 */
async function getAll({ page, pageSize, search, order, userId }) {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const productsPerPage = Math.min(
    Math.max(parseInt(pageSize, 10) || 10, 1),
    100,
  );
  const keyword = search || "";
  const orderBy = order || "recent";

  let where = {};

  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const sortOption = {
    recent: { createdAt: "desc" },
    like: { likeCount: "desc" },
  }[orderBy] || {
    createdAt: "desc",
    likeCount: "desc",
  };

  const offset = (currentPage - 1) * productsPerPage;

  const { data, totalProducts } = await productRepository.findAll({
    where,
    skip: offset,
    take: productsPerPage,
    orderBy: sortOption,
  });

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const hasNextPage = currentPage < totalPages;

  const likedProductIds = userId
    ? await productRepository.findLikedProductIds({
        ownerId: userId,
        productIds: data.map((product) => product.id),
      })
    : [];
  const likedProductIdSet = new Set(likedProductIds); // 성능 개선을 위해 Set 사용

  return {
    data: data.map((product) => ({
      ...convertToProductResponse(product),
      isLiked: likedProductIdSet.has(product.id),
    })),
    pagination: {
      totalProducts,
      totalPages,
      currentPage,
      hasNextPage,
    },
  };
}

/** 상품 단건 조회 서비스 로직
 * - userId가 있으면 isLiked 계산 */
async function getById(id, userId) {
  const product = await productRepository.findById(id);

  const isLiked = userId
    ? Boolean(
        await productRepository.findLikedProductById({
          ownerId: userId,
          productId: id,
        }),
      )
    : false;

  return { ...convertToProductResponse(product), isLiked };
}

/** 상품 등록 서비스 로직 */
async function create({ data, userId }) {
  const product = await productRepository.create({
    data,
    tags: data.tags,
    userId,
  });

  return convertToProductResponse(product);
}

/** 상품 수정 서비스 로직
 * - 상품을 등록한 유저만 수정 가능 */
async function update({ id, data, userId }) {
  const ownerId = await productRepository.findOwnerId(id);

  if (ownerId !== userId) {
    throw new AppError("본인이 등록한 상품만 수정할 수 있습니다.", 403);
  }

  const updatedProduct = await productRepository.update({ id, data });

  return convertToProductResponse(updatedProduct);
}

/** 상품 삭제 서비스 로직
 * - 상품을 등록한 유저만 삭제 가능 */
async function deleteById(id, userId) {
  const ownerId = await productRepository.findOwnerId(id);
  
  if (ownerId !== userId) {
    throw new AppError("본인이 등록한 상품만 삭제할 수 있습니다.", 403);
  }

  return await productRepository.deleteById(id);
}

/** 좋아요 토글 서비스 로직 */
async function toggleLike({ ownerId, productId }) {
  const hasLikedProduct = await productRepository.findLikedProductById({
    ownerId,
    productId,
  });

  await productRepository.toggleLike({
    hasLikedProduct,
    ownerId,
    productId,
  });

  return { liked: !hasLikedProduct };
}

export default { getAll, getById, create, update, deleteById, toggleLike };
