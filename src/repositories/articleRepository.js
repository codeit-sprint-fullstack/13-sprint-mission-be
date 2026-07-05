import prisma from "../config/prisma.js";

async function create(article) {
  const createdArticle = await prisma.article.create({
    data: article,
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return createdArticle;
}

async function findAll(page, pageSize, orderBy, keyword) {
  const skip = (Number(page) - 1) * Number(pageSize);
  const where = {};

  if (keyword) {
    where.OR = [
      { title: { contains: keyword } },
      { content: { contains: keyword } },
    ];
  }
  const queryOptions = {
    where,
    orderBy: { [orderBy]: "desc" },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  };
  if (page && pageSize) {
    queryOptions.skip = (Number(page) - 1) * Number(pageSize);
    queryOptions.take = Number(pageSize);
  }

  const articles = await prisma.article.findMany(queryOptions);
  return articles;
}

async function countByKeyword(keyword) {
  const where = {};
  if (keyword) {
    where.OR = [
      { title: { contains: keyword } },
      { content: { contains: keyword } },
    ];
  }
  const count = await prisma.article.count({ where });
  return count;
}

async function findById(articleId) {
  const article = await prisma.article.findUnique({
    where: { id: Number(articleId) },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return article;
}

async function update(articleId, update) {
  const updatedArticle = await prisma.article.update({
    where: { id: Number(articleId) },
    data: update,
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return updatedArticle;
}

async function deleteById(articleId) {
  const deletedArticle = await prisma.article.delete({
    where: { id: Number(articleId) },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return deletedArticle;
}

async function findCommentsByArticleId(articleId) {
  const comments = await prisma.comment.findMany({
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

async function findLike(articleId, userId) {
  const like = await prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId: Number(userId),
        articleId: Number(articleId),
      },
    },
  });

  return like;
}

async function like(articleId, userId) {
  const likeUpdatedArticle = await prisma.$transaction(async (tx) => {
    await tx.articleLike.create({
      data: {
        articleId: Number(articleId),
        userId: Number(userId),
      },
    });

    const updatedArticle = await tx.article.update({
      where: { id: Number(articleId) },
      data: {
        favoriteCount: {
          increment: 1,
        },
      },
    });

    return updatedArticle;
  });
  return likeUpdatedArticle;
}

async function unlike(articleId, userId) {
  const likeUpdatedArticle = await prisma.$transaction(async (tx) => {
    await tx.articleLike.delete({
      where: {
        userId_articleId: {
          articleId: Number(articleId),
          userId: Number(userId),
        },
      },
    });

    const updatedArticle = await tx.article.update({
      where: { id: Number(articleId) },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    });

    return updatedArticle;
  });
  return likeUpdatedArticle;
}

export default {
  create,
  findAll,
  countByKeyword,
  findById,
  update,
  deleteById,
  findCommentsByArticleId,
  findLike,
  like,
  unlike,
};
