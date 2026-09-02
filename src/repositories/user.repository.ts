import { prisma } from "../lib/prisma";

const findByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const findById = (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

const create = (data: {
  email: string;
  nickname: string;
  encryptedPassword: string;
}) => {
  return prisma.user.create({ data });
};

const updateRefreshToken = (id: number, refreshToken: string | null) => {
  return prisma.user.update({ where: { id }, data: { refreshToken } });
};

export default { findByEmail, findById, create, updateRefreshToken };