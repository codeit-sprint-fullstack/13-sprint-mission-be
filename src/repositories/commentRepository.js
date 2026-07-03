import prisma from "../config/prisma.js";

async function create(articleId, comment) {
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

async function findById(commentId) {
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
  return comment;
}

async function findAll(articleId, cursor) {
  const comments = await prisma.comment.findMany({
    take: 10,
    cursor: cursor ? { id: Number(cursor) } : undefined,
    skip: cursor ? 1 : 0,
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

async function update(articleId, commentId, update) {
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

async function deleteById(commentId) {
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
