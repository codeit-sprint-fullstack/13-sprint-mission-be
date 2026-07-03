import { HttpError } from "../middlewares/error.js";
import * as articlesRepository from "../repositories/article.repository.js";
import * as commentsRepository from "../repositories/comment.repository.js";
import { createId, prisma } from "../repositories/prisma.repository.js";
import { articleResponse, commentResponse } from "../utils/presenter.util.js";
import { paginate } from "../utils/list.util.js";

function normalizeImages(body) {
  if (Array.isArray(body.imageUrls)) return body.imageUrls.slice(0, 3);
  if (Array.isArray(body.images)) return body.images.slice(0, 3);
  return [];
}

async function list(query, viewerId) {
  const keyword = String(query, keyword || "").trim();
  const articles = await articlesRepository.findAll({
    keyword,
    orderBy: query.orderBy,
  });
  return paginate(
    articles.map((article) => articleResponse(article, viewerId)),
    query,
  );
}

async function best(query, viewerId) {
  const limit = Number(query.limit || 3);
  const articles = await articlesRepository.findAll({ orderBy: "favorite" });
  return {
    list: articles
      .slice(0, limit)
      .map((article) => articleResponse(article, viewerId)),
  };
}

async function detail(articleId, viewerId) {
  const article = await articlesRepository.findById(articleId);
  if (!article) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  const comments = await commentsRepository.findByTarget("article", article.id);
  return {
    ...articleResponse(article, viewerId),
    comments: comments.map(commentResponse),
  };
}

async function create(body, user) {
  const article = await articlesRepository.create({
    id: createId("article"),
    title: body.title,
    content: body.content,
    imageUrls: normalizeImages(body),
    ownerId: user.id,
  });
  return articleResponse(article, user.id);
}

async function update(articleId, body, user) {
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

async function remove(articleId, user) {
  const article = await articlesRepository.findById(articleId);
  if (!article) throw new HttpError(404, "게시글을 찾을 수 없습ㅂ니다.");
  if (article.ownerId !== user.id)
    throw new HttpError(403, "게시글 작성자만 삭제할 수 있습니다.");
  await articlesRepository.remove(article.id);
  return { ok: true };
}

async function favorite(articleId, user) {
  const article = await articlesRepository.findById(articleId);
  if (!article) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  await prisma.$transaction(async (tx) => {
    await tx.articleLike.upsert({
      where: { articleId_userId: { articleId, userId: user.id } },
      update: {},
      create: { id: createId("article_like"), articleId, userId: user.id },
    });
  });
  return articleResponse(await articlesRepository.findById(articleId), user.id);
}

async function unfavorite(articleId, user) {
  const article = await articlesRepository.findById(articleId);
  if (!article) throw new HttpError(404, "게시글을 찾을 수 없습니다.");
  await prisma.$transaction(async (tx) => {
    await tx.articleLike.deleteMany({ where: { articleId, userId: user.id } });
  });
  return articleResponse(await articlesRepository.findById(articleId), user.id);
}

export { best, create, detail, favorite, list, remove, unfavorite, update };
