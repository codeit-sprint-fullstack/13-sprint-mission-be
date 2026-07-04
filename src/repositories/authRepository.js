import prisma from "../config/prisma.js";

async function create(user) {
  const createdUser = await prisma.user.create({
    data: user,
    omit: {
      password: true,
    },
  });
  return createdUser;
}

async function findById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
}

async function findByEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}

async function findByUsername(username) {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;
}

export default { create, findById, findByEmail, findByUsername };
