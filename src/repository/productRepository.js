import prisma from "#/lib/prisma.js";

const productRepository = {
  findMany({ orderBy, skip, take }) {
    return prisma.product.findMany({ orderBy, skip, take });
  },

  count() {
    return prisma.product.count();
  },

  findById(id) {
    return prisma.product.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.product.create({ data });
  },

  update(id, data) {
    return prisma.product.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.product.delete({ where: { id } });
  },
};

export default productRepository;
