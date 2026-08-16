import type { ArticleComment, Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import type { UpdateCommentInput } from "./articleComment.Schema";

interface FindManyParams {
  articleId: string;
  cursor?: string;
  limit: number;
}

export type ArticleCommentListItem = Prisma.ArticleCommentGetPayload<{
  select: {
    id: true;
    content: true;
    createdAt: true;
    updatedAt: true;
    user: { select: { id: true; nickname: true; image: true } };
  };
}>;

interface CreateArticleCommentData {
  id: string;
  content: string;
  articleId: string;
  userId: string;
}

const articleCommentRepository = {
  findMany({ articleId, cursor, limit }: FindManyParams): Promise<ArticleCommentListItem[]> {
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

  findById(id: string): Promise<ArticleComment | null> {
    return prisma.articleComment.findUnique({ where: { id } });
  },

  create(data: CreateArticleCommentData): Promise<ArticleComment> {
    return prisma.articleComment.create({ data });
  },

  update(id: string, data: UpdateCommentInput): Promise<ArticleComment> {
    return prisma.articleComment.update({ where: { id }, data });
  },

  delete(id: string): Promise<ArticleComment> {
    return prisma.articleComment.delete({ where: { id } });
  },
};

export default articleCommentRepository;
