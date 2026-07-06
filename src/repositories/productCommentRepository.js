import prisma from "../config/prisma.js";

async function create(productId, comment) {
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

async function findById(productCommentId) {
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
  return comment;
}

async function findAll(productId, cursor) {
  const comments = await prisma.productComment.findMany({
    take: 10,
    cursor: cursor ? { id: Number(cursor) } : undefined,
    skip: cursor ? 1 : 0,
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

async function update(productId, productCommentId, update) {
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

async function deleteById(productCommentId) {
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
