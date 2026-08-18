import type { User, Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";

type CreateUserData = Pick<
  Prisma.UserUncheckedCreateInput,
  "id" | "email" | "nickname" | "encryptedPassword"
>;

const userRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  },

  updateRefreshToken(id: string, refreshToken: string | null): Promise<User> {
    return prisma.user.update({ where: { id }, data: { refreshToken } });
  },
};

export default userRepository;
