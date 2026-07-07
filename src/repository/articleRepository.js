import prisma from "#/lib/prisma.js";

const articleRepository = {
  findMany({ orderBy, skip, take }) {
    return prisma.article.findMany({ orderBy, skip, take });
  },

  count() {
    return prisma.article.count();
  },

  findById(id) {
    return prisma.article.findUnique({
      where: { id },
      select: { id: true, title: true, content: true, createdAt: true },
    });
  },

  create(data) {
    return prisma.article.create({ data });
  },

  update(id, data) {
    return prisma.article.update({ where: { id }, data });
  },

  delete(id) {
    return prisma.article.delete({ where: { id } });
  },
};

export default articleRepository;
