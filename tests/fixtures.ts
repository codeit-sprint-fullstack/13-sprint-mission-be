import type {
  User,
  Product,
  Favorite,
  Article,
  ArticleLike,
  ArticleComment,
  ProductComment,
} from "@prisma/client";
import { createToken } from "../src/utils/jwt";

const FIXED_DATE = new Date("2026-01-01T00:00:00.000Z");

/** 테스트에서 "로그인한 나" 역할을 하는 사용자 */
export const testUser: User = {
  id: 1,
  email: "panda@test.com",
  nickname: "판다",
  // bcrypt.compare는 테스트에서 모킹하므로 해시 값 자체는 의미가 없다.
  encryptedPassword: "$2b$10$abcdefghijklmnopqrstuv",
  image: null,
  createdAt: FIXED_DATE,
  updatedAt: FIXED_DATE,
};

/** 권한 검증 테스트용 — 남의 상품을 건드리는 상황을 만들기 위한 다른 사용자 */
export const otherUser: User = {
  ...testUser,
  id: 999,
  email: "other@test.com",
  nickname: "다른사람",
};

/** testUser가 등록한 상품 */
export const testProduct: Product = {
  id: 1,
  name: "판다 인형",
  description: "거의 새것입니다.",
  price: 15000,
  tags: ["인형", "판다"],
  images: [],
  favoriteCount: 0,
  createdAt: FIXED_DATE,
  updatedAt: FIXED_DATE,
  userId: testUser.id,
};

/** otherUser가 등록한 상품 — 내가 수정/삭제하면 403이 나와야 한다 */
export const othersProduct: Product = {
  ...testProduct,
  id: 2,
  name: "남의 상품",
  userId: otherUser.id,
};

export const testFavorite: Favorite = {
  id: 1,
  userId: testUser.id,
  productId: testProduct.id,
  createdAt: FIXED_DATE,
};

/** testUser가 쓴 게시글 */
export const testArticle: Article = {
  id: 1,
  title: "판다마켓 후기",
  content: "거래가 편합니다.",
  image: null,
  likeCount: 0,
  createdAt: FIXED_DATE,
  updatedAt: FIXED_DATE,
  userId: testUser.id,
};

/** otherUser가 쓴 게시글 — 내가 수정/삭제하면 403이 나와야 한다 */
export const othersArticle: Article = {
  ...testArticle,
  id: 2,
  title: "남의 게시글",
  userId: otherUser.id,
};

export const testArticleLike: ArticleLike = {
  id: 1,
  userId: testUser.id,
  articleId: testArticle.id,
  createdAt: FIXED_DATE,
};

/** testUser가 쓴 게시글 댓글 */
export const testArticleComment: ArticleComment = {
  id: 1,
  content: "좋은 글이네요.",
  createdAt: FIXED_DATE,
  updatedAt: FIXED_DATE,
  articleId: testArticle.id,
  userId: testUser.id,
};

/** otherUser가 쓴 댓글 */
export const othersArticleComment: ArticleComment = {
  ...testArticleComment,
  id: 2,
  content: "남의 댓글",
  userId: otherUser.id,
};

export const testProductComment: ProductComment = {
  id: 1,
  content: "이거 아직 있나요?",
  createdAt: FIXED_DATE,
  updatedAt: FIXED_DATE,
  productId: testProduct.id,
  userId: testUser.id,
};

/** 실제 JWT를 발급해서 Authorization 헤더 형태로 돌려준다. */
export function authHeader(user: User = testUser): string {
  return `Bearer ${createToken(user)}`;
}
