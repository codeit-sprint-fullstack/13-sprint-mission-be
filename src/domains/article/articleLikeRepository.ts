import type { ArticleLike } from "@prisma/client";
import prisma from "../../lib/prisma";

interface FindOneParams {
  userId: string;
  articleId: string;
}

const articleLikeRepository = {
  findOne({ userId, articleId }: FindOneParams): Promise<ArticleLike | null> {
    return prisma.articleLike.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  },
};

export default articleLikeRepository;
