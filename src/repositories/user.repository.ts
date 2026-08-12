// ============================================================
// User Repository
// ============================================================
import { User } from "@prisma/client";
import prisma from "../config/prisma.js";

async function findById(id: User["id"]) {
  return await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      nickname: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export default {
  findById,
};
