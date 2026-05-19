const prisma = require("../lib/prisma");

exports.createProduct = async (data) => {
  return await prisma.product.create({ data });
};

exports.countProducts = async (where) => {
  return await prisma.product.count({ where });
};

exports.findProducts = async (where, orderBy, skip, take) => {
  return await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take,
  });
};

exports.findProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

exports.deleteProduct = async (id) => {
  return await prisma.product.delete({
    where: { id },
  });
};

exports.incrementFavoriteCount = async (id) => {
  return await prisma.product.update({
    where: { id },
    data: { favoriteCount: { increment: 1 } },
  });
};
