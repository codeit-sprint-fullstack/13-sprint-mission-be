const articleRepository = require("../repositories/articleRepository");
const { validateArticle } = require("../schemas/articleSchema");

exports.createArticle = async (articleData) => {
  const validationError = validateArticle(articleData);
  if (validationError) {
    const error = new Error(validationError);
    error.status = 400;
    throw error;
  }

  const { title, content } = articleData;
  return await articleRepository.createArticle({ title, content });
};

exports.getArticles = async (queryOptions) => {
  const page = parseInt(queryOptions.page) || 1;
  const pageSize = parseInt(queryOptions.pageSize) || 10;
  const skip = (page - 1) * pageSize;
  const keyword = queryOptions.keyword || "";
  const orderBy = queryOptions.orderBy || "recent";

  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const sorting =
    orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

  const totalCount = await articleRepository.countArticles(where);
  const list = await articleRepository.findArticles(
    where,
    sorting,
    skip,
    pageSize,
  );

  return { list, totalCount };
};

exports.getArticleById = async (id) => {
  const article = await articleRepository.findArticleById(id);
  if (!article) {
    const error = new Error("존재하지 않는 게시글입니다.");
    error.status = 404;
    throw error;
  }
  return article;
};

exports.updateArticle = async (id, updateData) => {
  const validationError = validateArticle(updateData);
  if (validationError) {
    const error = new Error(validationError);
    error.status = 400;
    throw error;
  }

  const { title, content } = updateData;
  return await articleRepository.updateArticle(id, { title, content });
};

exports.favoriteArticle = async (id) => {
  return await articleRepository.incrementFavoriteCount(id);
};
