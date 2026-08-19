import { prisma } from "./prisma.repository";
import type { Prisma, User } from "@prisma/client";

function findById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

function create(data: Prisma.UserCreateInput): Promise<User> {
  return prisma.user.create({ data });
}

function update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
  return prisma.user.update({ where: { id }, data });
}

export { create, findByEmail, findById, update };
