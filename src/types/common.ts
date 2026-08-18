import type { User } from "@prisma/client";

export interface PaginatedResult<T> {
  list: T[];
  totalCount: number;
}

export interface CursorPaginatedResult<T> {
  list: T[];
  nextCursor: string | null;
}

export type PublicUser = Omit<User, "encryptedPassword" | "refreshToken">;
