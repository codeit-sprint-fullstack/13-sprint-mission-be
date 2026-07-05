// ============================================================
// Comment 컨트롤러
// ============================================================
import commentService from "../services/comment.service.js";
import parseId from "../utils/parse.js";

/** 상품 댓글 조회
 * - GET /products/:productId/comments
 */
async function getAllProductComments(req, res, next) {
  const comments = await commentService.getAll({
    type: "product",
    id: parseId(req.params.productId),
    userId: req.user ? parseId(req.user.userId) : undefined,
  });

  res.json({ success: true, comments });
}

/** 상품 댓글 생성
 * - POST /products/:productId/comments
 */
async function createProductComment(req, res, next) {
  const newProductComment = await commentService.create({
    type: "product",
    id: parseId(req.params.productId),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    ownerId: parseId(req.user.userId),
  });

  res.status(201).json({ success: true, data: newProductComment });
}

/** 게시글 댓글 조회
 * - GET /articles/:articleId/comments
 */
async function getAllArticleComments(req, res, next) {
  const comments = await commentService.getAll({
    type: "article",
    id: parseId(req.params.articleId),
    userId: req.user ? parseId(req.user.userId) : undefined,
  });

  res.json({ success: true, comments });
}

/** 게시글 댓글 생성
 * - POST /articles/:articleId/comments
 */
async function createArticleComment(req, res, next) {
  const newArticleComment = await commentService.create({
    type: "article",
    id: parseId(req.params.articleId),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    ownerId: parseId(req.user.userId),
  });

  res.status(201).json({ success: true, data: newArticleComment });
}

/** 상품 댓글 수정
 * - PATCH /products/:productId/comments/:commentId
 */
async function updateProductComment(req, res, next) {
  const updatedComment = await commentService.update({
    id: parseId(req.params.commentId),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    type: "product",
    userId: parseId(req.user.userId),
  });

  res.json({ success: true, data: updatedComment });
}

/** 상품 댓글 삭제
 * - DELETE /products/:productId/comments/:commentId
 */
async function deleteProductComment(req, res, next) {
  await commentService.deleteById({
    id: parseId(req.params.commentId),
    type: "product",
    userId: parseId(req.user.userId),
  });

  res.json({ success: true, message: "댓글이 삭제되었습니다" });
}

/** 게시글 댓글 수정
 * - PATCH /articles/:articleId/comments/:commentId
 */
async function updateArticleComment(req, res, next) {
  const updatedComment = await commentService.update({
    id: parseId(req.params.commentId),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    type: "article",
    userId: parseId(req.user.userId),
  });

  res.json({ success: true, data: updatedComment });
}

/** 게시글 댓글 삭제
 * - DELETE /articles/:articleId/comments/:commentId
 */
async function deleteArticleComment(req, res, next) {
  await commentService.deleteById({
    id: parseId(req.params.commentId),
    type: "article",
    userId: parseId(req.user.userId),
  });

  res.json({ success: true, message: "댓글이 삭제되었습니다" });
}

export default {
  getAllProductComments,
  createProductComment,
  getAllArticleComments,
  createArticleComment,
  updateProductComment,
  deleteProductComment,
  updateArticleComment,
  deleteArticleComment,
};
