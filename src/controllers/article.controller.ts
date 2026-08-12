// ============================================================
// Article 컨트롤러
// ============================================================
import { NextFunction, Request, Response } from "express";
import articleService from "../services/article.service.js";
import { ArticleInput, ArticleQuery } from "../types/article.js";
import parseId from "../utils/parse.js";

/** 게시글 조회 컨트롤러
 * - GET /articles
 */
async function getAllArticles(
  req: Request<{}, {}, {}, ArticleQuery>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const {
    page = "1",
    pageSize = "10",
    search = "",
    order = "recent",
  } = req.query;
  const { data, pagination } = await articleService.getAll({
    page,
    pageSize,
    search,
    order,
    userId: req.user.userId,
  });

  res.json({ success: true, data, pagination });
}

/** 단일 게시글 조회 컨트롤러
 * - GET /articles/:id
 */
async function getArticle(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const article = await articleService.getById(
    parseId(req.params.id),
    req.user.userId,
  );

  res.json({ success: true, data: article });
}

/** 게시글 등록 컨트롤러
 * - POST /articles
 */
async function createArticle(
  req: Request<{}, {}, ArticleInput>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const newArticle = await articleService.create({
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    userId: req.user.userId,
  });

  res.status(201).json({ success: true, data: newArticle });
}

/** 게시글 수정 컨트롤러
 * - PATCH /articles/:id
 */
async function updateArticle(
  req: Request<{ id: string }, {}, ArticleInput>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const updatedArticle = await articleService.update({
    id: parseId(req.params.id),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    userId: req.user.userId,
  });

  res.json({ success: true, data: updatedArticle });
}

/** 게시글 삭제 컨트롤러
 * - DELETE /articles/:id
 */
async function deleteArticle(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  await articleService.deleteById(parseId(req.params.id), req.user.userId);

  res.json({ success: true, message: "게시글이 삭제되었습니다" });
}

/** 게시글 좋아요 컨트롤러
 * - POST /articles/:articleId/likes
 */
async function toggleArticleLike(
  req: Request<{ articleId: string }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const likedArticle = await articleService.toggleLike({
    ownerId: req.user.userId,
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
