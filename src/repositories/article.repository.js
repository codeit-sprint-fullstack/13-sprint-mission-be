import { prisma } from "./prisma.repository.js";

const include = {
  owner: true,
  likes: true,
};

function findAll({ keyword, orderBy } = {}) {
  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.article.findMany({
    where,
    include,
    orderBy:
      orderBy === "favorite"
        ? { likes: { _count: "desc" } }
        : { createdAt: "desc" },
  });
}

function findById(id) {
  return prisma.article.findUnique({ where: { id }, include });
}

function create(data) {
  return prisma.article.create({ data, include });
}

function update(id, data) {
  return prisma.article.update({ where: { id }, data, include });
}

function remove(id) {
  return prisma.article.delete({ where: { id } });
}

export { create, findAll, findById, remove, update };
