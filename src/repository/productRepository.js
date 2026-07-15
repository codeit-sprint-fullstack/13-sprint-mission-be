import prisma from "#/lib/prisma.js";

const productRepository = {
  findMany({ orderBy, skip, take }) {
    return prisma.product.findMany({ orderBy, skip, take });
  },

  count() {
    return prisma.product.count();
  },

  findById(id, userId) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: { select: { id: true, nickname: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        ...(userId && {
          likes: { where: { userId }, select: { userId: true } },
        }),
      },
    });
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
