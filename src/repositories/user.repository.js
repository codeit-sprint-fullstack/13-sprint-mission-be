import { prisma } from "./prisma.repository.js";

function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

function create(data) {
  return prisma.user.create({ data });
}

function update(id, data) {
  return prisma.user.update({ where: { id }, data });
}

export { create, findByEmail, findById, update };
