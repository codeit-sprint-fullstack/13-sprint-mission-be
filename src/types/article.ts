import type { Article, User } from "@prisma/client";

//1. Request 관련 타입들
export type ArticlePostRequestType = Pick<
  Article,
  "title" | "content" | "image"
>;
export type ArticlePatchRequestType = Partial<ArticlePostRequestType>;
export type ArticleFindAllRequestType = {
  page?: number | undefined;
  pageSize?: number | undefined;
  orderBy?: "favoriteCount" | "createdAt" | undefined;
  keyword?: string | undefined;
  userId?: User["id"] | undefined;
};

//2. Response 관련 타입들
export type ArticleReturnType = Article & {
  user: Omit<User, "password">;
};
