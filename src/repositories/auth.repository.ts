// ============================================================
// Auth Repository
// ============================================================
import prisma from "../config/prisma.js";

async function create(user) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    },
  });
}

async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function findById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function update(id, data) {
  
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

export default { create, findByEmail, findById, update };
