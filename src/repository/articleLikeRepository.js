import prisma from "#/lib/prisma.js";

const articleLikeRepository = {
  findOne({ userId, articleId }) {
    return prisma.articleLike.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  },
};

export default articleLikeRepository;
