import prisma from "../config/prisma";
import createError from "../utils/createError";

import { Article, Comment } from "@prisma/client";
import { CommentRequestType, CommentReturnType } from "./../types/comment";

async function create(
  articleId: Article["id"],
  comment: CommentRequestType,
): Promise<CommentReturnType> {
  const createdComment = await prisma.comment.create({
    data: {
      articleId: Number(articleId),
      ...comment,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return createdComment;
}

async function findById(commentId: Comment["id"]): Promise<CommentReturnType> {
  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  if (!comment) {
    throw createError(404, "댓글을 찾을 수 없습니다.");
  }
  return comment;
}

async function findAll(
  articleId: Article["id"],
  cursor?: number,
): Promise<CommentReturnType[]> {
  const comments = await prisma.comment.findMany({
    take: 10,
    ...(cursor !== undefined ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: {
      id: "asc",
    },
    where: { articleId: Number(articleId) },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return comments;
}

async function update(
  articleId: Article["id"],
  commentId: Comment["id"],
  update: CommentRequestType,
): Promise<CommentReturnType> {
  const updatedComment = await prisma.comment.update({
    where: { id: Number(commentId) },
    data: {
      articleId: Number(articleId),
      ...update,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return updatedComment;
}

async function deleteById(
  commentId: Comment["id"],
): Promise<CommentReturnType> {
  const deletedComment = await prisma.comment.delete({
    where: { id: Number(commentId) },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return deletedComment;
}

export default { create, findById, findAll, update, deleteById };
