import articleRepository from "../repositories/articleRepository.js";
import createError from "../utils/createError.js";

const VALID_ORDER_BY = ["createdAt", "favoriteCount"];

const createArticle = async (data) => {
  const { title, content } = data;

  if (!title || !content)
    throw createError(400, "title과 content는 필수 값입니다.");

  return articleRepository.create(data);
};

const getArticles = async (page, pageSize, orderBy, keyword) => {
  if (page && Number(page) < 1)
    throw createError(400, "page는 1 이상이어야 합니다.");
  if (pageSize && Number(pageSize) < 1)
    throw createError(400, "pageSize는 1 이상이어야 합니다.");
  if (orderBy && !VALID_ORDER_BY.includes(orderBy))
    throw createError(400, "잘못된 정렬 기준입니다.");

  const [articles, totalCount] = await Promise.all([
    articleRepository.findAll(page, pageSize, orderBy, keyword),
    articleRepository.countByKeyword(keyword),
  ]);

  return {
    totalCount,
    list: articles,
  };
};

const getArticleDetail = async (articleId) => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");

  const comments = await articleRepository.findCommentsByArticleId(articleId);

  return {
    ...article,
    comments,
  };
};

const updateArticle = async (articleId, data) => {
  const { title, content } = data;
  const article = await articleRepository.findById(articleId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");
  if (!title && !content)
    throw createError(400, "수정할 값을 하나 이상 입력해야 합니다.");

  return articleRepository.update(articleId, data);
};

const deleteArticle = async (articleId) => {
  const article = await articleRepository.findById(articleId);
  if (!article) throw createError(404, "게시글을 찾을 수 없습니다.");

  const deletedArticle = await articleRepository.deleteById(articleId);
  return deletedArticle;
};

export default {
  createArticle,
  getArticles,
  getArticleDetail,
  updateArticle,
  deleteArticle,
};
