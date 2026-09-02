import { NextFunction, Request, Response } from "express";
import {
  createArticleSchema,
  getArticleListQuerySchema,
  updateArticleSchema,
} from "../schemas/article.schema";
import { idSchema } from "../schemas/common.schema";
import ArticleService from "../services/article.service";
import { AuthenticationError } from "../types/errors";
import z from "zod";

async function getArticleList(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, pageSize, sort, keyword } = req.validatedQuery as z.infer<
      typeof getArticleListQuerySchema
    >;

    const { articles, total, pageNum, take } = await ArticleService.findArticle(
      page,
      pageSize,
      sort,
      keyword,
    );

    res.json({
      success: true,
      page: pageNum,
      pageSize: take,
      totalCount: total,
      totalPages: Math.ceil(total / take),
      filters: { keyword, sort },
      list: articles,
    });
  } catch (error) {
    next(error);
  }
}

async function getArticleByID(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: articleId } = idSchema.parse(req.params);
    const userId = req.auth?.userId;

    if (!userId) {
      throw new AuthenticationError("존재하지 않는 사용자입니다.");
    }

    const article = await ArticleService.findArticleById(articleId, userId!);
    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
}

async function postArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedBody = createArticleSchema.parse(req.body);
    const writerId = req.auth?.userId;

    if (!writerId) {
      throw new AuthenticationError("존재하지 않는 사용자입니다.");
    }

    const article = await ArticleService.createArticle({
      title: validatedBody.title,
      content: validatedBody.content,
      writerId,
      images: [],
    });

    res.json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
}

async function patchArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    const data = updateArticleSchema.parse(req.body);
    const article = await ArticleService.updateArticle(id, data);

    res.json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
}

async function deleteArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idSchema.parse(req.params);
    await ArticleService.deleteArticle(id);
    res.json({ success: true, message: "article이 삭제되었습니다" });
  } catch (error) {
    next(error);
  }
}

async function postArticleLike(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id: articleId } = idSchema.parse(req.params);
    const userId = req.auth?.userId;

    if (!userId) {
      throw new AuthenticationError("존재하지 않는 사용자입니다.");
    }

    const result = await ArticleService.addLikeArticle(articleId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteArticleLike(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id: articleId } = idSchema.parse(req.params);
    const userId = req.auth?.userId;

    if (!userId) {
      throw new AuthenticationError("존재하지 않는 사용자입니다.");
    }

    const result = await ArticleService.unLikeArticle(articleId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export default {
  getArticleList,
  getArticleByID,
  postArticle,
  patchArticle,
  deleteArticle,
  postArticleLike,
  deleteArticleLike,
};
