import { User } from "@prisma/client";

export type UserReturnType = Omit<User, "password">;
