import { HttpError } from "../middlewares/error";
import * as articlesRepository from "../repositories/article.repository";
import * as commentsRepository from "../repositories/comment.repository";
import { createId, prisma } from "../repositories/prisma.repository";
import { articleResponse, commentResponse } from "../utils/presenter.util";
import { paginate } from "../utils/list.util";
import type {
  ArticleBody,
  AuthUser,
  ListQuery,
  ViewerId,
} from "../types/domain";

function normalizeImages(
  body: Pick<ArticleBody, "imageUrls" | "images">,
): string[] {
  if (Array.isArray(body.imageUrls)) return body.imageUrls.slice(0, 3);
  if (Array.isArray(body.images)) return body.images.slice(0, 3);
  return [];
}

async function list(query: ListQuery, viewerId?: ViewerId) {
  const keyword = String(query.keyword || "").trim();
  const articles = await articlesRepository.findAll({
    keyword,
    orderBy: query.orderBy,
  });
  return paginate(
    articles.map((article) => articleResponse(article, viewerId)),
    query,
  );
}

async function best(query: ListQuery, viewerId?: ViewerId) {
  const limit = Number(query.limit || 3);
  const articles = await articlesRepository.findAll({ orderBy: "favorite" });
  return {
    list: articles
      .slice(0, limit)
      .map((article) => articleResponse(article, viewerId)),
  };
}

async function detail(articleId: string, viewerId?: ViewerId) {
  const article = await articlesRepository.findById(articleId);
  if (!article) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  const comments = await commentsRepository.findByTarget("article", article.id);
  return {
    ...articleResponse(article, viewerId),
    comments: comments.map(commentResponse),
  };
}

async function create(body: ArticleBody, user: AuthUser) {
  const article = await articlesRepository.create({
    id: createId("article"),
    title: body.title,
    content: body.content,
    imageUrls: normalizeImages(body),
    ownerId: user.id,
  });
  return articleResponse(article, user.id);
}

async function update(articleId: string, body: ArticleBody, user: AuthUser) {
  const article = await articlesRepository.findById(articleId);
  if (!article) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  if (article.ownerId !== user.id)
    throw new HttpError(403, "게시글 작성자만 수정할 수 있습니다.");
  const updated = await articlesRepository.update(articleId, {
    title: body.title,
    content: body.content,
    imageUrls: normalizeImages(body),
  });
  return articleResponse(updated, user.id);
}

async function remove(articleId: string, user: AuthUser) {
  const article = await articlesRepository.findById(articleId);
  if (!article) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  if (article.ownerId !== user.id)
    throw new HttpError(403, "게시글 작성자만 삭제할 수 있습니다.");
  await articlesRepository.remove(article.id);
  return { ok: true };
}

async function favorite(articleId: string, user: AuthUser) {
  const article = await articlesRepository.findById(articleId);
  if (!article) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  await prisma.$transaction(async (tx) => {
    await tx.articleLike.upsert({
      where: { articleId_userId: { articleId, userId: user.id } },
      update: {},
      create: { id: createId("article_like"), articleId, userId: user.id },
    });
  });
  const updated = await articlesRepository.findById(articleId);
  if (!updated) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  return articleResponse(updated, user.id);
}

async function unfavorite(articleId: string, user: AuthUser) {
  const article = await articlesRepository.findById(articleId);
  if (!article) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  await prisma.$transaction(async (tx) => {
    await tx.articleLike.deleteMany({ where: { articleId, userId: user.id } });
  });
  const updated = await articlesRepository.findById(articleId);
  if (!updated) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  return articleResponse(updated, user.id);
}

export { best, create, detail, favorite, list, remove, unfavorite, update };
