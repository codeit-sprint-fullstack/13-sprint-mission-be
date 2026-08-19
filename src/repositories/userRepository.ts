import type { User } from "@prisma/client";
import type { UserReturnType } from "../types/user.js";
import prisma from "../config/prisma.js";

async function find(userId: User["id"]): Promise<UserReturnType | null> {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
}

export default { find };
