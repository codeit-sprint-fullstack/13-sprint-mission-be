// ============================================================
// Product Repository
// ============================================================
import prisma from "../config/prisma.js";

/** 상품 목록 조회 
 * - 검색 / 정렬 / 페이지네이션 */
async function findAll({ where, skip, take, orderBy }) {
  const [data, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
      include: { tags: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { data, totalProducts };
}

/** 상품 단건 조회 
 * - 태그 / 좋아요수 / 작성자 / 댓글 포함 */
async function findById(id) {
  return await prisma.product.findUniqueOrThrow({
    where: { id },
    include: {
      tags: true,
      owner: true,
      productComments: true,
    },
  });
}

/** 상품 생성 
 * - 태그 함께 생성 */
async function create({ data, tags, userId }) {
  return await prisma.product.create({
    data: {
      ...data,
      // Tag 모델 형식으로 변환
      tags: {
        create: tags.map((tagName) => ({
          tag: tagName,
        })),
      },
      owner: { connect: { id: userId } },
    },
    include: {
      tags: true,
    },
  });
}

/** 상품 소유자 id 조회 (권한 체크용) */
async function findOwnerId(id) {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
    select: { ownerId: true },
  });

  return product.ownerId;
}

/** 상품 수정
 * - 태그 있으면 전체 삭제 후 재생성 */
async function update({ id, data }) {
  const { tags, ...withoutTagsData } = data;

  return await prisma.product.update({
    where: { id },
    data: {
      // tags를 제외한 기본 필드 (있으면 업데이트)
      ...withoutTagsData,
      // tags (있으면 삭제 후 새로 생성)
      ...(tags && {
        tags: {
          deleteMany: {}, // 기존 tags 모두 삭제
          create: tags.map((tagName) => ({
            tag: tagName,
          })),
        },
      }),
    },
    include: {
      tags: true,
    },
  });
}

/** 상품 삭제 */
async function deleteById(id) {
  return await prisma.product.delete({
    where: { id },
  });
}

/** 좋아요 토글
 * - 이미 눌렀으면 취소(삭제), 아니면 등록(생성)
 * - ProductLike row 증감과 Product.likeCount 증감을 하나의 트랜잭션으로 처리 */
async function toggleLike({ hasLikedProduct, ownerId, productId }) {
  if (!hasLikedProduct) {
    const [productLike] = await prisma.$transaction([
      prisma.productLike.create({
        data: { ownerId, productId },
      }),
      prisma.product.update({
        where: { id: productId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    return productLike;
  }

  const [productLike] = await prisma.$transaction([
    prisma.productLike.delete({
      where: { ownerId_productId: { ownerId, productId } },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { likeCount: { decrement: 1 } },
    }),
  ]);
  
  return productLike;
}

/** 특정 유저가 특정 상품에 좋아요 눌렀는지 조회 */
async function findLikedProductById({ ownerId, productId }) {
  return await prisma.productLike.findUnique({
    where: {
      ownerId_productId: { ownerId, productId },
    },
  });
}

/** 특정 유저가 주어진 상품 목록 중 좋아요 누른 상품 id 목록 조회 */
async function findLikedProductIds({ ownerId, productIds }) {
  const likes = await prisma.productLike.findMany({
    where: { ownerId, productId: { in: productIds } },
    select: { productId: true },
  });

  return likes.map((like) => like.productId);
}

export default {
  findAll,
  findById,
  findOwnerId,
  create,
  update,
  deleteById,
  toggleLike,
  findLikedProductById,
  findLikedProductIds,
};
