const express = require("express");
const prisma = require("../lib/prisma");
const ENDPOINTS = require("../constants/endpoints");
const {
  authenticate,
  optionalAuthenticate,
} = require("../middlewares/authMiddleware");

const router = express.Router();

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

const parsePositiveInt = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
};

const getArticleInclude = (userId) => ({
  owner: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
  likes: userId
    ? {
        where: { userId },
        select: { id: true },
      }
    : undefined,
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
});

const getCommentInclude = () => ({
  writer: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
});

const serializeArticle = (article) => ({
  id: article.id,
  title: article.title,
  content: article.content,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  ownerId: article.ownerId,
  ownerNickname: article.owner?.nickname || null,
  owner: article.owner,
  favoriteCount: article._count?.likes || 0,
  commentCount: article._count?.comments || 0,
  isFavorite: Boolean(article.likes?.length),
  isLiked: Boolean(article.likes?.length),
});

const serializeComment = (comment) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  articleId: comment.articleId,
  writerId: comment.writerId,
  writer: comment.writer,
});

const getArticleWhere = (keyword) => {
  if (!keyword) {
    return {};
  }

  return {
    OR: [
      { title: { contains: keyword, mode: "insensitive" } },
      { content: { contains: keyword, mode: "insensitive" } },
    ],
  };
};

const getArticlesOrderBy = (orderBy) => {
  if (orderBy === "favorite") {
    return [{ likes: { _count: "desc" } }, { createdAt: "desc" }];
  }

  return [{ createdAt: "desc" }];
};

const getArticleId = (req) => Number.parseInt(req.params.id, 10);

const getArticles = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
    const pageSize = Math.min(
      parsePositiveInt(req.query.pageSize, DEFAULT_PAGE_SIZE),
      MAX_PAGE_SIZE,
    );
    const keyword = req.query.keyword?.trim() || "";
    const orderBy = req.query.orderBy || "recent";
    const skip = (page - 1) * pageSize;
    const where = getArticleWhere(keyword);

    const [totalCount, articles] = await prisma.$transaction([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        include: getArticleInclude(req.user?.id),
        orderBy: getArticlesOrderBy(orderBy),
        skip,
        take: pageSize,
      }),
    ]);

    return res.json({
      list: articles.map(serializeArticle),
      totalCount,
    });
  } catch (err) {
    return next(err);
  }
};

const getArticle = async (req, res, next) => {
  try {
    const articleId = getArticleId(req);

    if (Number.isNaN(articleId)) {
      return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: getArticleInclude(req.user?.id),
    });

    if (!article) {
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });
    }

    return res.json(serializeArticle(article));
  } catch (err) {
    return next(err);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "제목과 내용은 필수 입력 항목입니다." });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        ownerId: req.user.id,
      },
      include: getArticleInclude(req.user.id),
    });

    return res.status(201).json(serializeArticle(article));
  } catch (err) {
    return next(err);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const articleId = getArticleId(req);
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();

    if (Number.isNaN(articleId)) {
      return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
    }

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "제목과 내용은 필수 입력 항목입니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, ownerId: true },
    });

    if (!article) {
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });
    }

    if (article.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "게시글을 수정할 권한이 없습니다." });
    }

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: { title, content },
      include: getArticleInclude(req.user.id),
    });

    return res.json(serializeArticle(updatedArticle));
  } catch (err) {
    return next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const articleId = getArticleId(req);

    if (Number.isNaN(articleId)) {
      return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, ownerId: true },
    });

    if (!article) {
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });
    }

    if (article.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "게시글을 삭제할 권한이 없습니다." });
    }

    await prisma.article.delete({
      where: { id: articleId },
    });

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

const getArticleComments = async (req, res, next) => {
  try {
    const articleId = getArticleId(req);

    if (Number.isNaN(articleId)) {
      return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });

    if (!article) {
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });
    }

    const comments = await prisma.articleComment.findMany({
      where: { articleId },
      include: getCommentInclude(),
      orderBy: { createdAt: "desc" },
    });

    return res.json({ list: comments.map(serializeComment) });
  } catch (err) {
    return next(err);
  }
};

const createArticleComment = async (req, res, next) => {
  try {
    const articleId = getArticleId(req);
    const content = req.body.content?.trim();

    if (Number.isNaN(articleId)) {
      return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
    }

    if (!content) {
      return res.status(400).json({ message: "댓글 내용을 입력해 주세요." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });

    if (!article) {
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });
    }

    const comment = await prisma.articleComment.create({
      data: {
        content,
        articleId,
        writerId: req.user.id,
      },
      include: getCommentInclude(),
    });

    return res.status(201).json(serializeComment(comment));
  } catch (err) {
    return next(err);
  }
};

const updateArticleComment = async (req, res, next) => {
  try {
    const articleId = getArticleId(req);
    const commentId = Number.parseInt(req.params.commentId, 10);
    const content = req.body.content?.trim();

    if (Number.isNaN(articleId) || Number.isNaN(commentId)) {
      return res.status(400).json({ message: "유효하지 않은 요청입니다." });
    }

    if (!content) {
      return res.status(400).json({ message: "댓글 내용을 입력해 주세요." });
    }

    const comment = await prisma.articleComment.findFirst({
      where: { id: commentId, articleId },
      select: { id: true, writerId: true },
    });

    if (!comment) {
      return res.status(404).json({ message: "존재하지 않는 댓글입니다." });
    }

    if (comment.writerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "댓글을 수정할 권한이 없습니다." });
    }

    const updatedComment = await prisma.articleComment.update({
      where: { id: commentId },
      data: { content },
      include: getCommentInclude(),
    });

    return res.json(serializeComment(updatedComment));
  } catch (err) {
    return next(err);
  }
};

const deleteArticleComment = async (req, res, next) => {
  try {
    const articleId = getArticleId(req);
    const commentId = Number.parseInt(req.params.commentId, 10);

    if (Number.isNaN(articleId) || Number.isNaN(commentId)) {
      return res.status(400).json({ message: "유효하지 않은 요청입니다." });
    }

    const comment = await prisma.articleComment.findFirst({
      where: { id: commentId, articleId },
      select: { id: true, writerId: true },
    });

    if (!comment) {
      return res.status(404).json({ message: "존재하지 않는 댓글입니다." });
    }

    if (comment.writerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "댓글을 삭제할 권한이 없습니다." });
    }

    await prisma.articleComment.delete({
      where: { id: commentId },
    });

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

const addArticleFavorite = async (req, res, next) => {
  try {
    const articleId = getArticleId(req);

    if (Number.isNaN(articleId)) {
      return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });

    if (!article) {
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });
    }

    await prisma.articleLike.upsert({
      where: {
        articleId_userId: {
          articleId,
          userId: req.user.id,
        },
      },
      create: {
        articleId,
        userId: req.user.id,
      },
      update: {},
    });

    const likedArticle = await prisma.article.findUnique({
      where: { id: articleId },
      include: getArticleInclude(req.user.id),
    });

    return res.json(serializeArticle(likedArticle));
  } catch (err) {
    return next(err);
  }
};

const deleteArticleFavorite = async (req, res, next) => {
  try {
    const articleId = getArticleId(req);

    if (Number.isNaN(articleId)) {
      return res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });

    if (!article) {
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });
    }

    await prisma.articleLike.deleteMany({
      where: {
        articleId,
        userId: req.user.id,
      },
    });

    const unlikedArticle = await prisma.article.findUnique({
      where: { id: articleId },
      include: getArticleInclude(req.user.id),
    });

    return res.json(serializeArticle(unlikedArticle));
  } catch (err) {
    return next(err);
  }
};

router
  .route(ENDPOINTS.ARTICLES)
  .get(optionalAuthenticate, getArticles)
  .post(authenticate, createArticle);

router
  .route(ENDPOINTS.ARTICLE_BY_ID)
  .get(optionalAuthenticate, getArticle)
  .patch(authenticate, updateArticle)
  .delete(authenticate, deleteArticle);

router
  .route(ENDPOINTS.ARTICLE_COMMENTS)
  .get(getArticleComments)
  .post(authenticate, createArticleComment);

router
  .route(ENDPOINTS.ARTICLE_COMMENT_BY_ID)
  .patch(authenticate, updateArticleComment)
  .delete(authenticate, deleteArticleComment);

router
  .route(ENDPOINTS.ARTICLE_FAVORITE)
  .post(authenticate, addArticleFavorite)
  .delete(authenticate, deleteArticleFavorite);

module.exports = router;
