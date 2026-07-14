import prisma from "../../config/prisma.js";

async function findById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function create({ email, nickname, encryptedPassword }) {
  return prisma.user.create({
    data: {
      email,
      nickname,
      encryptedPassword,
    },
  });
}

async function updateRefreshToken(id, refreshToken) {
  return prisma.user.update({
    where: { id },
    data: { refreshToken },
  });
}

export default {
  findById,
  findByEmail,
  create,
  updateRefreshToken,
};
