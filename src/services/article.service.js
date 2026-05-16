import prisma from "../configs/prisma.js";

// 게시글 생성
export const createArticle = async ({ title, content }) => {
  return prisma.article.create({
    data: {
      title,
      content,
    },
  });
};

// 게시글 단건 조회
export const getArticle = async (id) => {
  const article = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!article) {
    const error = new Error("게시글이 존재하지 않습니다");
    error.status = 404;

    throw error;
  }

  return article;
};

// 게시글 수정
export const updateArticle = async (id, data) => {
  const article = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!article) {
    const error = new Error("게시글이 존재하지 않습니다");
    error.status = 404;

    throw error;
  }

  return prisma.article.update({
    where: {
      id: Number(id),
    },

    data,
  });
};

// 게시글 삭제
export const deleteArticle = async (id) => {
  const article = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!article) {
    const error = new Error("게시글이 존재하지 않습니다");
    error.status = 404;

    throw error;
  }

  return prisma.article.delete({
    where: {
      id: Number(id),
    },
  });
};

// 게시글 목록 조회
export const getArticles = async ({ page = 1, limit = 10, keyword = "" }) => {
  const skip = (Number(page) - 1) * Number(limit);

  const where = keyword
    ? {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },

          {
            content: {
              contains: keyword,
            },
          },
        ],
      }
    : {};

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: Number(limit),

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.article.count({
      where,
    }),
  ]);

  return {
    data: articles,
    totalCount,
    currentPage: Number(page),
    totalPages: Math.ceil(totalCount / Number(limit)),
  };
};
