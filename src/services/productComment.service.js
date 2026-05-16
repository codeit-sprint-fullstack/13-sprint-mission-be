import prisma from "../configs/prisma.js";

export const cerateComment = async (productId, { content }) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    const error = new Error("상품이 존재하지 않습니다.");
    error.status = 404;

    throw error;
  }

  return prisma.comment.create({
    data: {
      content,

      product: {
        connect: {
          id: Number(productId),
        },
      },
    },
  });
};

export const getComments = async ({ productId, cursor, limit = 5 }) => {
  const comments = await prisma.comment.findMant({
    where: {
      productId: Number(productId),
    },

    take: Number(limit),

    ...(cursor && {
      skip: 1,

      cursor: {
        id: Number(cursor),
      },
    }),

    ordeerBy: {
      id: "desc",
    },
  });

  const nextCursor =
    comments.length === Number(limit) ? comments[comments.length - 1].id : null;

  return {
    data: comments,
    nextCursor,
  };
};

export const updateComment = async (commentId, data) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(commentId),
    },
  });

  if (!comment) {
    const error = new Error("상품이 존재하지 않습니다");
    error.status = 404;
  }

  return prisma.comment.update({
    where: {
      id: Number(commentId),
    },

    data,
  });
};

export const deleteComment = async (commentId) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(commentId),
    },
  });

  if (!comment) {
    const error = new Error("상품이 존재하지 않습니다");
    error.status = 404;

    throw ErrorEvent;
  }

  return prisma.comment.delete({
    where: {
      id: Number(commentId),
    },
  });
};
