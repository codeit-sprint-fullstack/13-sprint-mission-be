import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

const withUser = {
  user: { select: { id: true, nickName: true, image: true } },
} satisfies Prisma.CommentInclude;

export type CommentWithUser = Prisma.CommentGetPayload<{
  include: typeof withUser;
}>;

export interface CommentCreateData {
  content: string;
  ownerId: number;
  productId?: number | null;
  articleId?: number | null;
}

export interface CommentUpdateData {
  content: string;
}

async function getAllByProduct(productId: number, limit?: number) {
  const comments = await prisma.comment.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: withUser,
  });
  return comments;
}

async function getAllByArticle(articleId: number, limit?: number) {
  const comments = await prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: withUser,
  });
  return comments;
}

async function getById(id: number) {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
    include: withUser,
  });
  return comment;
}
async function save(comment: CommentCreateData) {
  const createdComment = await prisma.comment.create({
    data: {
      content: comment.content,
      user: {
        connect: { id: comment.ownerId },
      },
      ...(comment.productId && {
        product: { connect: { id: comment.productId } },
      }),
      ...(comment.articleId && {
        article: { connect: { id: comment.articleId } },
      }),
    },
  });
  return createdComment;
}

async function update(id: number, comment: CommentUpdateData) {
  const updateComment = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      content: comment.content,
    },
  });
  return updateComment;
}

async function deleteById(id: number) {
  const deleteComment = await prisma.comment.delete({
    where: {
      id,
    },
  });
  return deleteComment;
}

export default {
  getAllByProduct,
  getAllByArticle,
  getById,
  save,
  update,
  deleteById,
};
