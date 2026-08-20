import type { ProductComment, User } from "@prisma/client";

//1. Request 관련 타입들
export type ProductCommentRequestType = Pick<
  ProductComment,
  "content" | "userId"
>;

//2. Response 관련 타입들
export type ProductCommentReturnType = ProductComment & {
  user: Omit<User, "password">;
};
