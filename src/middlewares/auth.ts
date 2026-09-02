import { expressjwt } from "express-jwt";
import { prisma } from "../lib/prisma";
import { ForbiddenError, NotFoundError } from "../types/errors";
import { NextFunction, Request, Response } from "express";

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

const isLoggedIn = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"],
});

async function isProductOwner(req: Request, res: Response, next: NextFunction) {
  const productId = Number(req.params.id);
  const loginUserId = req.auth?.userId;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      const error = new NotFoundError("해당 상품을 찾을 수 없습니다.");
      throw error;
    }
    if (product.writerId !== loginUserId) {
      const error = new ForbiddenError(
        "상품 등록자만 수정 및 삭제가 가능합니다.",
      );
      throw error;
    }
    next();
  } catch (error) {
    return next(error);
  }
}

async function isArticleOwner(req: Request, res: Response, next: NextFunction) {
  const articleId = Number(req.params.id);
  const loginUserId = req.auth?.userId;

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      const error = new NotFoundError("해당 게시글을 찾을 수 없습니다.");
      throw error;
    }

    if (article.writerId !== loginUserId) {
      const error = new ForbiddenError(
        "게시글 작성자만 수정 및 삭제가 가능합니다.",
      );
      throw error;
    }

    next();
  } catch (error) {
    return next(error);
  }
}

async function isCommentOwner(req: Request, res: Response, next: NextFunction) {
  const commentId = Number(req.params.id);
  const loginUserId = req.auth?.userId;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      const error = new NotFoundError("해당 댓글을 찾을 수 없습니다.");
      throw error;
    }

    if (comment.writerId !== loginUserId) {
      const error = new ForbiddenError("댓글 수정 및 삭제 권한이 없습니다.");
      throw error;
    }

    next();
  } catch (error) {
    return next(error);
  }
}

export default {
  verifyRefreshToken,
  isLoggedIn,
  isProductOwner,
  isArticleOwner,
  isCommentOwner,
};
