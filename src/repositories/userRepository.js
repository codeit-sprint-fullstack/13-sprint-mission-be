import prisma from "../config/prisma.js";

async function findById(id) {
  return prisma.user.findUnique({
    where: {
      id,
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

async function save(user) {
  return await prisma.user.create({
    data: {
      email: user.email,
      nickName: user.nickName,
      encryptedpassword: user.encryptedpassword,
      image: user.image,
    },
  });
}

async function update(id, data) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

async function createOrUpdate(provider, providerId, email, nickName) {
  return await prisma.user.upsert({
    where: { provider_providerId: { provider, providerId } },
    update: { email, nickName },
    create: { provider, providerId, email, nickName },
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
  createOrUpdate,
};
