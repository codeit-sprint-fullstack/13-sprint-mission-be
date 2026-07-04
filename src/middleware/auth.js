import { expressjwt } from "express-jwt";
import createError from "../utils/createError.js";
import articleRepository from "../repositories/articleRepository.js";
import commentRepository from "../repositories/commentRepository.js";
import productRepository from "../repositories/productRepository.js";

function verifyAccessToken() {
  return expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  });
}

async function verifyArticleAuth(req, res, next) {
  const { articleId } = req.params;
  const article = await articleRepository.findById(articleId);

  if (!article) throw createError(404, "댓글을 찾을 수 없습니다.");
  if (req.auth.id !== article.user.id)
    throw createError(403, "해당 글에 대한 권한이 없습니다.");

  next();
}

async function verifyCommentAuth(req, res, next) {
  const { commentId } = req.params;
  const comment = await commentRepository.findById(commentId);

  if (!comment) throw createError(404, "댓글을 찾을 수 없습니다.");
  if (req.auth.id !== comment.user.id)
    throw createError(403, "해당 댓글에 대한 권한이 없습니다.");

  next();
}

async function verifyProductAuth(req, res, next) {
  const { productId } = req.params;
  const product = await productRepository.findById(productId);

  if (!product) throw createError(404, "상품을 찾을 수 없습니다.");
  if (req.auth.id !== product.user.id)
    throw createError(403, "해당 상품에 대한 권한이 없습니다.");

  next();
}

export default {
  verifyAccessToken,
  verifyArticleAuth,
  verifyCommentAuth,
  verifyProductAuth,
};
