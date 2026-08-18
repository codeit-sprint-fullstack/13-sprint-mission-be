// ============================================================
// Auth Repository
// ============================================================
import { Prisma, User } from "@prisma/client";
import prisma from "../config/prisma.js";

async function create(user: Pick<User, "email" | "nickname" | "password">) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    },
  });
}

async function findByEmail(email: User["email"]) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function findById(id: User["id"]) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function update(id: User["id"], data: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

export default { create, findByEmail, findById, update };
