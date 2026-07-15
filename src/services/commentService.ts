import prisma from "../models/prismaClient";

export const commentService = {
  createComment: async (
    ownerId: number,
    productId: number,
    content: string,
  ) => {
    return await prisma.comment.create({
      data: { ownerId, productId, content },
    });
  },

  getCommentsByProductId: async (productId: number) => {
    return await prisma.comment.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, nickname: true, image: true } } },
    });
  },

  updateComment: async (id: number, content: string) => {
    return await prisma.comment.update({
      where: { id },
      data: { content },
    });
  },

  deleteComment: async (id: number) => {
    return await prisma.comment.delete({
      where: { id },
    });
  },
};
