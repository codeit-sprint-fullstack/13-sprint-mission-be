import type { ProductLike } from "@prisma/client";
import prisma from "../../lib/prisma";

interface FindOneParams {
  userId: string;
  productId: string;
}

const productLikeRepository = {
  findOne({ userId, productId }: FindOneParams): Promise<ProductLike | null> {
    return prisma.productLike.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  },
};

export default productLikeRepository;
