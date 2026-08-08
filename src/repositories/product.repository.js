import { prisma } from "./prisma.repository.js";

const include = {
  owner: true,
  likes: true,
};

function findAll({ keyword, orderBy } = {}) {
  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.product.findMany({
    where,
    include,
    orderBy:
      orderBy === "favorite"
        ? { likes: { _count: "desc" } }
        : { createdAt: "desc" },
  });
}

function findById(id) {
  return prisma.product.findUnique({ where: { id }, include });
}

function create(data) {
  return prisma.product.create({ data, include });
}

function update(id, data) {
  return prisma.product.update({ where: { id }, data, include });
}

function remove(id) {
  return prisma.product.delete({ where: { id } });
}

export { create, findAll, findById, remove, update };
