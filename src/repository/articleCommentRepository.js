import prisma from "#/lib/prisma.js";

const articleCommentRepository = {
  findMany({ articleId, cursor, limit }) {
    return prisma.articleComment.findMany({
      where: { articleId },
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

  create(data) {
    return prisma.articleComment.create({ data });
  },

  update(id, data) {
    return prisma.articleComment.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.articleComment.delete({ where: { id } });
  },
};

export default articleCommentRepository;
