const { prisma } = require("./prisma.repository");

const include = { owner: true };

function findById(id) {
  return prisma.comment.findUnique({ where: { id }, include });
}

function findByTarget(targetType, targetId) {
  return prisma.comment.findMany({
    where: { targetType, targetId },
    include,
    orderBy: { createdAt: "desc" },
  });
}

function create(data) {
  return prisma.comment.create({ data, include });
}

function update(id, data) {
  return prisma.comment.update({ where: { id }, data, include });
}

function remove(id) {
  return prisma.comment.delete({ where: { id } });
}

module.exports = { create, findById, findByTarget, remove, update };
