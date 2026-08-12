import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

async function findById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function save(user: Prisma.UserUncheckedCreateInput) {
  return await prisma.user.create({
    data: {
      email: user.email,
      nickName: user.nickName,
      encryptedpassword: user.encryptedpassword,
      image: user.image,
    },
  });
}

async function update(id: number, data: Prisma.UserUncheckedUpdateInput) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
};
