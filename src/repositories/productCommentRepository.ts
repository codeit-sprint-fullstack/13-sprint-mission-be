import prisma from "../config/prisma";
import createError from "../utils/createError";

import type { Product, ProductComment } from "@prisma/client";
import type {
  ProductCommentRequestType,
  ProductCommentReturnType,
} from "../types/productComment";

async function create(
  productId: Product["id"],
  comment: ProductCommentRequestType,
): Promise<ProductCommentReturnType> {
  const createdComment = await prisma.productComment.create({
    data: {
      productId: Number(productId),
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

async function findById(
  productCommentId: ProductComment["id"],
): Promise<ProductCommentReturnType> {
  const comment = await prisma.productComment.findUnique({
    where: { id: Number(productCommentId) },
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
  productId: Product["id"],
  cursor?: number,
): Promise<ProductCommentReturnType[]> {
  const comments = await prisma.productComment.findMany({
    take: 10,
    ...(cursor !== undefined ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: {
      id: "asc",
    },
    where: { productId: Number(productId) },
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
  productId: Product["id"],
  productCommentId: ProductComment["id"],
  update: ProductCommentRequestType,
): Promise<ProductCommentReturnType> {
  const updatedComment = await prisma.productComment.update({
    where: { id: Number(productCommentId) },
    data: {
      productId: Number(productId),
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
  productCommentId: ProductComment["id"],
): Promise<ProductCommentReturnType> {
  const deletedComment = await prisma.productComment.delete({
    where: { id: Number(productCommentId) },
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
