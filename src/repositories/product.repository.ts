import prisma, { Prisma } from "../config/prisma.js";

// 좋아요 개수를 항상 같이 세어야 해서(좋아요순 정렬, isLiked 계산) _count.likes 공통 포함
const withLikeCount = { _count: { select: { likes: true } } };
// 작성자 닉네임/이미지 표시, 본인 글만 수정/삭제 가능하게 하려면 작성자 정보가 필요함
const withOwner = { user: { select: { id: true, nickname: true, image: true } } };

interface CreateProductParams {
  name: string;
  description: string;
  price: number;
  images?: string[];
  tags?: string[];
  userId?: number;
}

// [기본 요구사항] 상품 등록: "상품 정보 등록 API 엔드포인트에 요청을 보내 상품을 등록합니다."
// tags는 Tag 모델과 1:N 관계라 nested create로 함께 생성
export function create({ name, description, price, images, tags, userId }: CreateProductParams) {
  return prisma.product.create({
    data: {
      name,
      description,
      price,
      images,
      userId,
      tags:
        tags && tags.length > 0
          ? { create: tags.map((tagName) => ({ name: tagName })) }
          : undefined,
    },
    include: { tags: true },
  });
}

interface FindManyProductsParams {
  skip?: number;
  take?: number;
  keyword?: string;
  orderBy?: string;
}

function buildKeywordWhere(keyword?: string): Prisma.ProductWhereInput {
  return keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};
}

// [기본 요구사항] 중고마켓 페이지: "좋아요 순 정렬 기능을 붙여주세요."
// -> orderBy=favorite: 좋아요(likes) 개수 내림차순, 그 외(기본값): 최신순
// 베스트 상품(좋아요 많은 순 최대 4개)도 이 함수를 orderBy=favorite, take=4로 재사용해서 조회함
export function findMany({ skip, take, keyword, orderBy }: FindManyProductsParams) {
  const where = buildKeywordWhere(keyword);

  return prisma.product.findMany({
    where,
    skip,
    take,
    orderBy:
      orderBy === "favorite" ? { likes: { _count: "desc" } } : { createdAt: "desc" },
    include: { tags: true, ...withLikeCount, ...withOwner },
  });
}

export function count({ keyword }: { keyword?: string }) {
  const where = buildKeywordWhere(keyword);
  return prisma.product.count({ where });
}

// [기본 요구사항] 중고마켓 페이지: "베스트 상품 기능을 추가해 주세요. 베스트 상품은 가장 많이
// 좋아요를 받은 순으로 PC 기준 최대 4개까지 조회 가능합니다."
export function findAllWithLikeCount() {
  return prisma.product.findMany({
    include: { tags: true, ...withLikeCount, ...withOwner },
  });
}

// [기본 요구사항] 상품 상세: "해당 상품에 대한 댓글 리스트... 응답 객체에 포함시켜 반환해 주세요."
export function findById(id: number) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      tags: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, nickname: true } } },
      },
      ...withLikeCount,
      ...withOwner,
    },
  });
}

// 인가 체크(작성자 확인)용 가벼운 조회
export function findByIdSimple(id: number) {
  return prisma.product.findUnique({ where: { id } });
}

export function update(id: number, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data });
}

export function remove(id: number) {
  return prisma.product.delete({ where: { id } });
}
// [기본 요구사항] 좋아요 기능: "사용자는 상품에 '좋아요'를 할 수 있습니다. $transaction을 사용해 주세요."
// -> Like 생성과 최신 좋아요 개수 조회를 하나의 트랜잭션으로 묶어서, 응답에 바로 반영할 수 있게 함
export async function likeProduct(userId: number, productId: number) {
  const [, product] = await prisma.$transaction([
    prisma.like.create({ data: { userId, productId } }),
    prisma.product.findUnique({
      where: { id: productId },
      include: { tags: true, ...withLikeCount, ...withOwner },
    }),
  ]);
  return product;
}

// [기본 요구사항] 좋아요 기능: "사용자는 상품에 '좋아요'를 취소할 수 있습니다. $transaction을 사용해 주세요."
export async function unlikeProduct(userId: number, productId: number) {
  const [, product] = await prisma.$transaction([
    prisma.like.delete({
      where: { userId_productId: { userId, productId } },
    }),
    prisma.product.findUnique({
      where: { id: productId },
      include: { tags: true, ...withLikeCount, ...withOwner },
    }),
  ]);
  return product;
}

// 로그인한 사용자가 이 상품에 좋아요를 눌렀는지 확인 (isLiked 계산용)
export function isLikedByUser(userId: number, productId: number) {
  return prisma.like
    .findUnique({ where: { userId_productId: { userId, productId } } })
    .then(Boolean);
}

// GET /users/me/favorites: 내가 좋아요한 상품 목록
export function findFavoritesByUser(userId: number) {
  return prisma.product.findMany({
    where: { likes: { some: { userId } } },
    orderBy: { createdAt: "desc" },
    include: { tags: true, ...withLikeCount, ...withOwner },
  });
}
