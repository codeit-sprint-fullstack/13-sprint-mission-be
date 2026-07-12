// ============================================================
// Article 컨트롤러
// ============================================================
import parseId from "../utils/parse.js";
import articleService from "../services/article.service.js";

/** 게시글 조회 컨트롤러
 * - GET /articles
 */
async function getAllArticles(req, res, next) {
  const { page = 1, pageSize = 10, search = "", order = "recent" } = req.query;
  const { data, pagination } = await articleService.getAll({
    page,
    pageSize,
    search,
    order,
    userId: req.user ? parseId(req.user.userId) : undefined,
  });

  res.json({ success: true, data, pagination });
}

/** 단일 게시글 조회 컨트롤러
 * - GET /articles/:id
 */
async function getArticle(req, res, next) {
  const article = await articleService.getById(
    parseId(req.params.id),
    req.user ? parseId(req.user.userId) : undefined,
  );

  res.json({ success: true, data: article });
}

/** 게시글 등록 컨트롤러
 * - POST /articles
 */
async function createArticle(req, res, next) {
  const newArticle = await articleService.create({
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    userId: parseId(req.user.userId),
  });

  res.status(201).json({ success: true, data: newArticle });
}

/** 게시글 수정 컨트롤러
 * - PATCH /articles/:id
 */
async function updateArticle(req, res, next) {
  const updatedArticle = await articleService.update({
    id: parseId(req.params.id),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    userId: parseId(req.user.userId),
  });

  res.json({ success: true, data: updatedArticle });
}

/** 게시글 삭제 컨트롤러
 * - DELETE /articles/:id
 */
async function deleteArticle(req, res, next) {
  await articleService.deleteById(
    parseId(req.params.id),
    parseId(req.user.userId),
  );

  res.json({ success: true, message: "게시글이 삭제되었습니다" });
}

/** 게시글 좋아요 컨트롤러
 * - POST /articles/:articleId/likes
 */
async function toggleArticleLike(req, res, next) {
  const likedArticle = await articleService.toggleLike({
    ownerId: parseId(req.user.userId),
    articleId: parseId(req.params.articleId),
  });

  res.json({ success: true, data: likedArticle });
}

export default {
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleLike,
};
