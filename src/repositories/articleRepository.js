import prisma from "../config/prisma.js";

async function getAll(userId, { skip, take, orderBy, keyword } = {}) {
  const where = keyword
    ? { title: { contains: keyword, mode: "insensitive" } }
    : {};

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        likes: { where: { userId: userId ?? -1 } },
        user: { select: { id: true, nickName: true, image: true } },
      },
      orderBy,
      skip,
      take,
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, totalCount };
}

async function getById(id, userId) {
  const article = await prisma.article.findUnique({
    where: { id: Number(id) },
    include: {
      comments: true,
      likes: { where: { userId: userId ?? -1 } },
      user: { select: { id: true, nickName: true, image: true } },
    },
  });
  return article;
}

async function save(article) {
  const createArticle = await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
      likeCount: article.likeCount,
      image: article.image,
      ownerId: article.ownerId,
      userId: article.ownerId,
    },
  });
  return createArticle;
}

async function update(article) {
  const updateArticle = await prisma.article.update({
    where: {
      id: Number(article.id),
    },
    data: {
      title: article.title,
      content: article.content,
      likeCount: article.likeCount,
      image: article.image,
    },
  });
  return updateArticle;
}

async function deleteById(id) {
  const deleteArticle = await prisma.article.delete({
    where: {
      id: Number(id),
    },
  });
  return deleteArticle;
}

export default {
  getAll,
  getById,
  save,
  update,
  deleteById,
};
