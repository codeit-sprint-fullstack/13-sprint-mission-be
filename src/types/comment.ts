import type { Comment, User } from "@prisma/client";

//1. Request 관련 타입들
export type CommentRequestType = Pick<Comment, "content" | "userId">;

//2. Response 관련 타입들
export type CommentReturnType = Comment & { user: Omit<User, "password"> };
