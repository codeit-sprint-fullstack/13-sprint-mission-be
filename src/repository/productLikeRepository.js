import prisma from "#/lib/prisma.js";

const productLikeRepository = {
  findOne({ userId, productId }) {
    return prisma.productLike.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  },
};

export default productLikeRepository;
