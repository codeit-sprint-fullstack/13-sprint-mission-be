import type { Comment, User } from "@prisma/client";

export type CommentReturnType = Comment & { user: Omit<User, "password"> };
