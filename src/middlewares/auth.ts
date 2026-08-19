import { Request, RequestHandler } from "express";
import { expressjwt } from "express-jwt";
import env from "../config/env.js";
import HttpError from "../errors/HttpError.js";
import articleRepository from "../repositories/articleRepository.js";
import commentRepository from "../repositories/commentRepository.js";
import productRepository from "../repositories/productRepository.js";
import { parseId } from "./validate.js";

const attachUserIfPresent = expressjwt({
  secret: env.JWT_ACCESS_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false,
});

function getUserId(req: Request): number {
  if (!req.auth) {
    throw new HttpError("권한이 없습니다", 401);
  }
  return req.auth.userId;
}

const verifyAccessToken = expressjwt({
  secret: env.JWT_ACCESS_SECRET,
  algorithms: ["HS256"],
});

const verifyRefreshToken = expressjwt({
  secret: env.JWT_REFRESH_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

type OwnedRepository = {
  getById: (id: number) => Promise<{ ownerId: number } | null>;
};

const verifyOwner =
  (repository: OwnedRepository, label: string): RequestHandler =>
  async (req, res, next) => {
    try {
      const row = await repository.getById(parseId(req.params.id));
      if (!row) {
        throw new HttpError(`${label}을 불러올 수 없습니다.`, 404);
      }
      if (row.ownerId !== req.auth?.userId) {
        throw new HttpError("접근이 제한됩니다.", 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };

const verifyProductAuth = verifyOwner(productRepository, "상품");
const verifyArticleAuth = verifyOwner(articleRepository, "게시글");
const verifyCommentAuth = verifyOwner(commentRepository, "댓글");

export { getUserId };

export default {
  verifyAccessToken,
  verifyRefreshToken,
  verifyProductAuth,
  verifyArticleAuth,
  verifyCommentAuth,
  attachUserIfPresent,
};
