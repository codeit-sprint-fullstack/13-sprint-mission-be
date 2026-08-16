import type { Product } from "@prisma/client";

// GET /products 목록이 실제로 select하는 필드만 뽑아낸 타입 (Pick 유틸리티 타입)
export type ProductListItem = Pick<
  Product,
  "id" | "name" | "price" | "images" | "favoriteCount" | "createdAt"
>;

// 정렬 옵션 (Union 타입)
export type ProductSortOption = "recent" | "favorite";

// GET /products/:id 상세 응답에 포함되는 댓글 (작성자 정보 포함)
export interface ProductDetailComment {
  id: number;
  content: string;
  createdAt: Date;
  userId: number;
  user: { id: number; nickname: string; image: string | null };
}

// 상품 상세 응답 = 상품 & 댓글 목록 & 로그인 사용자의 좋아요 여부 (Intersection 타입)
export type ProductDetail = Product & {
  comments: ProductDetailComment[];
  isLiked: boolean;
};

// 좋아요/좋아요 취소 응답에서 쓰는 형태
export type ProductWithLikeStatus = Product & { isLiked: boolean };
