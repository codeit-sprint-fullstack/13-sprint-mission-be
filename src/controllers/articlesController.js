import prisma from "../utils/prisma.js";
import {
  articleIdParamSchema,
  articleListQuerySchema,
  createArticleSchema,
  updateArticleSchema,
} from "../validators/articleValidators.js";

export async function listArticles(req, res) {
  const { keyword, page = 1, limit = 10, sort = "recent" } =
    articleListQuerySchema.parse(req.query);

  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const orderBy = sort === "like" ? { likeCount: "desc" } : { createdAt: "desc" };

  const totalCount = await prisma.article.count({ where });
  const list = await prisma.article.findMany({
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

  res.status(200).json({ list, totalCount });
}

export async function createArticle(req, res) {
  const { title, content, image } = createArticleSchema.parse(req.body);

  const article = await prisma.article.create({
    data: { title, content, image, userId: req.user.id },
  });

  res.status(201).json({ article });
}

export async function getArticle(req, res) {
  const { id } = articleIdParamSchema.parse(req.params);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  let isLiked = false;
  if (req.user) {
    const like = await prisma.articleLike.findUnique({
      where: { userId_articleId: { userId: req.user.id, articleId: id } },
    });
    isLiked = Boolean(like);
  }

  res.status(200).json({ ...article, isLiked });
}

export async function updateArticle(req, res) {
  const { id } = articleIdParamSchema.parse(req.params);
  const data = updateArticleSchema.parse(req.body);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  if (article.userId !== req.user.id) {
    return res.status(403).json({ message: "수정 권한이 없습니다." });
  }

  const updated = await prisma.article.update({ where: { id }, data });
  res.status(200).json({ article: updated });
}

export async function deleteArticle(req, res) {
  const { id } = articleIdParamSchema.parse(req.params);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  if (article.userId !== req.user.id) {
    return res.status(403).json({ message: "삭제 권한이 없습니다." });
  }

  await prisma.article.delete({ where: { id } });
  res.status(204).send();
}

export async function likeArticle(req, res) {
  const { id } = articleIdParamSchema.parse(req.params);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  const existing = await prisma.articleLike.findUnique({
    where: { userId_articleId: { userId: req.user.id, articleId: id } },
  });
  if (existing) {
    return res.status(400).json({ message: "이미 좋아요한 게시글입니다." });
  }

  const [, updated] = await prisma.$transaction([
    prisma.articleLike.create({ data: { userId: req.user.id, articleId: id } }),
    prisma.article.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    }),
  ]);

  res.status(200).json({ ...updated, isLiked: true });
}

export async function unlikeArticle(req, res) {
  const { id } = articleIdParamSchema.parse(req.params);

  const existing = await prisma.articleLike.findUnique({
    where: { userId_articleId: { userId: req.user.id, articleId: id } },
  });
  if (!existing) {
    return res.status(400).json({ message: "좋아요하지 않은 게시글입니다." });
  }

  const [, updated] = await prisma.$transaction([
    prisma.articleLike.delete({
      where: { userId_articleId: { userId: req.user.id, articleId: id } },
    }),
    prisma.article.update({
      where: { id },
      data: { likeCount: { decrement: 1 } },
    }),
  ]);

  res.status(200).json({ ...updated, isLiked: false });
}
