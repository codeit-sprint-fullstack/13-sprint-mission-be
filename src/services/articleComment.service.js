import prisma from "../configs/prisma.js";

// 댓글 생성
export const createComment = async (articleId, { content }) => {
  const article = await prisma.article.findUnique({
    where: {
      id: Number(articleId),
    },
  });

  if (!article) {
    const error = new Error("게시글이 존재하지 않습니다");
    error.status = 404;

    throw error;
  }

  return prisma.comment.create({
    data: {
      content,

      article: {
        connect: {
          id: Number(articleId),
        },
      },
    },
  });
};

// 댓글 목록 조회 + cursor pagination
export const getComments = async ({ articleId, cursor, limit = 5 }) => {
  const comments = await prisma.comment.findMany({
    where: {
      articleId: Number(articleId),
    },

    take: Number(limit),

    ...(cursor && {
      skip: 1,

      cursor: {
        id: Number(cursor),
      },
    }),

    orderBy: {
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

// 댓글 수정
export const updateComment = async (commentId, data) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(commentId),
    },
  });

  if (!comment) {
    const error = new Error("댓글이 존재하지 않습니다");
    error.status = 404;
  }

  return prisma.comment.update({
    where: {
      id: Number(commentId),
    },

    data,
  });
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(commentId),
    },
  });

  if (!comment) {
    const error = new Error("댓글이 존재하지 않습니다");
    error.status = 404;

    throw error;
  }

  return prisma.comment.delete({
    where: {
      id: Number(commentId),
    },
  });
};
