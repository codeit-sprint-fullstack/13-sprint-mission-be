// ============================================================
// Article Service
// ============================================================
import articleRepository from "../repositories/article.repository.js";
import { AppError } from "../middlewares/errors.js";

/** 게시글 목록 조회 서비스 로직
 * - 검색 / 정렬 / 페이지네이션
 * - userId가 있으면 isLiked 계산 */
async function getAll({ page, pageSize, search, order, userId }) {
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const articlesPerPage = Math.min(
    Math.max(parseInt(pageSize, 10) || 10, 1),
    100,
  );
  const keyword = search || "";
  const orderBy = order || "recent";

  let where = {};

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { content: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const sortOption = {
    recent: { createdAt: "desc" },
    like: { likeCount: "desc" },
  }[orderBy] || { createdAt: "desc", likeCount: "desc" };

  const offset = (currentPage - 1) * articlesPerPage;

  const { data, totalArticles } = await articleRepository.findAll({
    where,
    skip: offset,
    take: articlesPerPage,
    orderBy: sortOption,
  });

  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const hasNextPage = currentPage < totalPages;

  const likedArticleIds = userId
    ? await articleRepository.findLikedArticleIds({
        ownerId: userId,
        articleIds: data.map((article) => article.id),
      })
    : [];
  const likedArticleIdSet = new Set(likedArticleIds); // 성능 개선을 위해 Set 사용

  return {
    data: data.map((article) => ({
      ...article,
      isLiked: likedArticleIdSet.has(article.id),
    })),
    pagination: {
      totalArticles,
      totalPages,
      currentPage,
      hasNextPage,
    },
  };
}

/** 게시글 단건 조회 서비스 로직
 * - userId가 있으면 isLiked 계산 */
async function getById(id, userId) {
  const article = await articleRepository.findById(id);

  const isLiked = userId
    ? Boolean(
        await articleRepository.findLikedArticleById({
          ownerId: userId,
          articleId: id,
        }),
      )
    : false;

  return { ...article, isLiked };
}

/** 게시글 등록 서비스 로직 */
async function create({ data, userId }) {
  return await articleRepository.create({
    data,
    userId,
  });
}

/** 게시글 수정 서비스 로직
 * - 게시글을 등록한 유저만 수정 가능 */
async function update({ id, data, userId }) {
  const ownerId = await articleRepository.findOwnerId(id);

  if (ownerId !== userId) {
    throw new AppError("본인이 등록한 게시글만 수정할 수 있습니다.", 403);
  }

  return await articleRepository.update({ id, data });
}

/** 게시글 삭제 서비스 로직
 * - 게시글을 등록한 유저만 삭제 가능 */
async function deleteById(id, userId) {
  const ownerId = await articleRepository.findOwnerId(id);

  if (ownerId !== userId) {
    throw new AppError("본인이 등록한 게시글만 삭제할 수 있습니다.", 403);
  }

  return await articleRepository.deleteById(id);
}

/** 좋아요 토글 서비스 로직 */
async function toggleLike({ ownerId, articleId }) {
  const hasLikedArticle = await articleRepository.findLikedArticleById({
    ownerId,
    articleId,
  });

  await articleRepository.toggleLike({
    hasLikedArticle,
    ownerId,
    articleId,
  });

  return { liked: !hasLikedArticle };
}

export default { getAll, getById, create, update, deleteById, toggleLike };
