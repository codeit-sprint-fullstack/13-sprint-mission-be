import articleRepository from "../repositories/articleRepository.js";

async function getAll(
  userId,
  { page = 1, pageSize = 10, limit, orderBy, keyword } = {},
) {
  const take = limit ? Number(limit) : Number(pageSize);
  const skip = limit ? 0 : (Number(page) - 1) * take;
  const orderByClause =
    orderBy === "like" ? { likeCount: "desc" } : { createdAt: "desc" };

  const { articles, totalCount } = await articleRepository.getAll(userId, {
    skip,
    take,
    orderBy: orderByClause,
    keyword,
  });

  const list = articles.map(({ likes, user, ...rest }) => ({
    ...rest,
    isLiked: likes.length > 0,
    writer: user
      ? { id: user.id, nickname: user.nickName, image: user.image }
      : null,
  }));

  return { list, totalCount };
}

async function getById(id, userId) {
  const article = await articleRepository.getById(id, userId);
  if (!article) {
    const error = new Error("게시글을 찾을 수 없습니다.");
    error.code = 404;
    throw error;
  }
  const { likes, user, ...rest } = article;
  return {
    ...rest,
    isLiked: likes.length > 0,
    writer: user
      ? { id: user.id, nickname: user.nickName, image: user.image }
      : null,
  };
}

async function create(article) {
  return articleRepository.save(article);
}

async function update(article) {
  return articleRepository.update(article);
}

async function deleteById(id) {
  return articleRepository.deleteById(id);
}

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
};
