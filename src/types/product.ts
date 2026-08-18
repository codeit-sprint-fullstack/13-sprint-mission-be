import { Product, User } from "@prisma/client";
import { CommentReturnType } from "./comment";

//1. Request 관련 타입들
export type ProductRequestType = Product & { tags: string[]; images: string[] };
export type ProductFindAllRequestType = {
  page?: number | undefined;
  pageSize?: number | undefined;
  orderBy?: string | undefined;
  keyword?: string | undefined;
  userId?: User["id"] | undefined;
};

//2. Response 관련 타입들
export type ProductReturnType = Product & {
  user?: Omit<User, "password">;
};
