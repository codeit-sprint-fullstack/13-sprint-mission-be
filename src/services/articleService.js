import articleRepository from "../repositories/articleRepository.js";

const createArticle = async (data) => {
  return articleRepository.create(data);
};

const getArticles = async (page, pageSize, orderBy, keyword) => {
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
  const comments = await articleRepository.findCommentsByArticleId(articleId);

  return {
    ...article,
    comments,
  };
};

const updateArticle = async (articleId, data) => {
  const article = await articleRepository.findById(articleId);

  return articleRepository.update(articleId, {
    ...data,
    userId: article.user.id,
  });
};

const deleteArticle = async (articleId) => {
  return articleRepository.deleteById(articleId);
};

export default {
  createArticle,
  getArticles,
  getArticleDetail,
  updateArticle,
  deleteArticle,
};
