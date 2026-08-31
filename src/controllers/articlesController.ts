import type { Request, Response } from "express";
import prisma from "../utils/prisma";
import {
  articleIdParamSchema,
  articleListQuerySchema,
  createArticleSchema,
  updateArticleSchema,
} from "../validators/articleValidators";
import type { PaginatedResult } from "../types/pagination";
import type { ArticleListItem, ArticleDetail, ArticleWithLikeStatus } from "../types/article";

export async function listArticles(req: Request, res: Response): Promise<void> {
  const { keyword, page = 1, limit = 10, sort = "recent" } =
    articleListQuerySchema.parse(req.query);

  // "insensitive"/"desc"는 Prisma가 리터럴 값만 허용해서, 타입 단언(as const)으로
  // 문자열이 아니라 그 리터럴 타입 그대로 유지되도록 고정한다.
  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" as const } },
          { content: { contains: keyword, mode: "insensitive" as const } },
        ],
      }
    : {};

  const orderBy =
    sort === "like" ? { likeCount: "desc" as const } : { createdAt: "desc" as const };

  const totalCount = await prisma.article.count({ where });
  const list: ArticleListItem[] = await prisma.article.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      likeCount: true,
      createdAt: true,
    },
  });

  const result: PaginatedResult<ArticleListItem> = { list, totalCount };
  res.status(200).json(result);
}

export async function createArticle(req: Request, res: Response): Promise<void> {
  const { title, content, image } = createArticleSchema.parse(req.body);

  const article = await prisma.article.create({
    data: { title, content, image, userId: req.user!.id },
  });

  res.status(201).json({ article });
}

export async function getArticle(req: Request, res: Response): Promise<void> {
  const { id } = articleIdParamSchema.parse(req.params);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    return;
  }

  let isLiked = false;
  if (req.user) {
    const like = await prisma.articleLike.findUnique({
      where: { userId_articleId: { userId: req.user.id, articleId: id } },
    });
    isLiked = Boolean(like);
  }

  const result: ArticleDetail = { ...article, isLiked };
  res.status(200).json(result);
}

export async function updateArticle(req: Request, res: Response): Promise<void> {
  const { id } = articleIdParamSchema.parse(req.params);
  const data = updateArticleSchema.parse(req.body);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    return;
  }
  if (article.userId !== req.user!.id) {
    res.status(403).json({ message: "수정 권한이 없습니다." });
    return;
  }

  const updated = await prisma.article.update({ where: { id }, data });
  res.status(200).json({ article: updated });
}

export async function deleteArticle(req: Request, res: Response): Promise<void> {
  const { id } = articleIdParamSchema.parse(req.params);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    return;
  }
  if (article.userId !== req.user!.id) {
    res.status(403).json({ message: "삭제 권한이 없습니다." });
    return;
  }

  await prisma.article.delete({ where: { id } });
  res.status(204).send();
}

export async function likeArticle(req: Request, res: Response): Promise<void> {
  const { id } = articleIdParamSchema.parse(req.params);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    return;
  }

  const existing = await prisma.articleLike.findUnique({
    where: { userId_articleId: { userId: req.user!.id, articleId: id } },
  });
  if (existing) {
    res.status(400).json({ message: "이미 좋아요한 게시글입니다." });
    return;
  }

  const [, updated] = await prisma.$transaction([
    prisma.articleLike.create({ data: { userId: req.user!.id, articleId: id } }),
    prisma.article.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    }),
  ]);

  const result: ArticleWithLikeStatus = { ...updated, isLiked: true };
  res.status(200).json(result);
}

export async function unlikeArticle(req: Request, res: Response): Promise<void> {
  const { id } = articleIdParamSchema.parse(req.params);

  const existing = await prisma.articleLike.findUnique({
    where: { userId_articleId: { userId: req.user!.id, articleId: id } },
  });
  if (!existing) {
    res.status(400).json({ message: "좋아요하지 않은 게시글입니다." });
    return;
  }

  const [, updated] = await prisma.$transaction([
    prisma.articleLike.delete({
      where: { userId_articleId: { userId: req.user!.id, articleId: id } },
    }),
    prisma.article.update({
      where: { id },
      data: { likeCount: { decrement: 1 } },
    }),
  ]);

  const result: ArticleWithLikeStatus = { ...updated, isLiked: false };
  res.status(200).json(result);
}
