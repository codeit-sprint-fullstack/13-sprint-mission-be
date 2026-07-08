import prisma from "#/lib/prisma.js";

const productCommentRepository = {
  findMany({ productId, cursor, limit }) {
    return prisma.productComment.findMany({
      where: { productId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, nickname: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });
  },

  findById(id) {
    return prisma.productComment.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.productComment.create({ data });
  },

  update(id, data) {
    return prisma.productComment.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.productComment.delete({ where: { id } });
  },
};

export default productCommentRepository;
