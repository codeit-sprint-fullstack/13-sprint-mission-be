import prisma from "../config/prisma.js";

async function find(userId) {
  return await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    omit: {
      password: true,
    },
  });
}

export default { find };
