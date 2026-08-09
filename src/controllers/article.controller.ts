import { Request, Response } from "express";
import * as articleService from "../services/article.service.js";
import { BadRequestError } from "../middlewares/errorHandler.js";
import {
  CreateArticleInput,
  UpdateArticleInput,
} from "../schemas/article.schema.js";

// 여기서 먼저 400으로 걸러줌
function parseArticleId(articleId: string) {
  const parsedId = parseInt(articleId);
  if (isNaN(parsedId)) {
    throw new BadRequestError("articleId는 숫자여야 합니다.");
  }
  return parsedId;
}

// [ ]  게시글 조회 API를 만들어 주세요.
// [ ] `id`, `title`, `content`, `createdAt`를 조회합니다.
export const getArticle = async (req: Request, res: Response) => {
  const { articleId } = req.params as { articleId: string };
  const article = await articleService.getArticle(parseArticleId(articleId), req.auth?.userId);
  res.json({ success: true, data: article });
};

// [ ]  게시글 등록 API를 만들어 주세요.
// [ ] `title`, `content`를 입력해 게시글을 등록합니다.
export const createArticle = async (req: Request, res: Response) => {
  const input = req.body as CreateArticleInput;
  const article = await articleService.createArticle(input, req.auth?.userId);
  res.status(201).json({ success: true, data: article });
};

// [ ]  게시글 수정 API를 만들어 주세요.
export const updateArticle = async (req: Request, res: Response) => {
  const { articleId } = req.params as { articleId: string };
  const data = req.body as UpdateArticleInput;
  const article = await articleService.updateArticle(parseArticleId(articleId), data);
  res.json({ success: true, data: article });
};

// [ ]  게시글 삭제 API를 만들어 주세요.
export const deleteArticle = async (req: Request, res: Response) => {
  const { articleId } = req.params as { articleId: string };
  await articleService.deleteArticle(parseArticleId(articleId));
  res.json({ success: true, message: "Article이 삭제되었습니다" });
};

// [ ]  게시글 목록 조회 API를 만들어 주세요.
// [ ] `id`, `title`, `content`, `createdAt`를 조회합니다.
// [ ]  offset 방식의 페이지네이션 기능을 포함해 주세요.
// [ ]  최신순(`recent`)으로 정렬할 수 있습니다.
// [ ] `title`, `content`에 포함된 단어로 검색할 수 있습니다.
export const getArticles = async (req: Request, res: Response) => {
  const {
    search,
    sort = "recent",
    page = "1",
    limit = "10",
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const take = Math.max(1, parseInt(limit) || 10);

  const { articles, total } = await articleService.getArticles({
    search,
    sort,
    page: pageNum,
    limit: take,
  });

  res.json({
    success: true,
    page: pageNum,
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
    data: articles,
  });
};
