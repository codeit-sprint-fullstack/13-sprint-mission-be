const { prisma } = require("./prisma.repository");

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

module.exports = { create, findByEmail, findById, update };
