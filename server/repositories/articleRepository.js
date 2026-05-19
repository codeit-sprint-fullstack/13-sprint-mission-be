const prisma = require("../lib/prisma");

exports.createArticle = async (data) => {
  return await prisma.article.create({ data });
};

exports.countArticles = async (where) => {
  return await prisma.article.count({ where });
};

exports.findArticles = async (where, orderBy, skip, take) => {
  return await prisma.article.findMany({ where, orderBy, skip, take });
};

exports.findArticleById = async (id) => {
  return await prisma.article.findUnique({ where: { id } });
};

exports.updateArticle = async (id, data) => {
  return await prisma.article.update({ where: { id }, data });
};

exports.deleteArticle = async (id) => {
  return await prisma.article.delete({ where: { id } });
};

exports.incrementFavoriteCount = async (id) => {
  return await prisma.article.update({
    where: { id },
    data: { favoriteCount: { increment: 1 } },
  });
};
