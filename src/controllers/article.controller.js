import * as articleRepository from "../repositories/article.repository.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../middlewares/errorHandler.js";

// 여기서 먼저 400으로 걸러줌
function parseArticleId(articleId) {
  const parsedId = parseInt(articleId);
  if (isNaN(parsedId)) {
    throw new BadRequestError("articleId는 숫자여야 합니다.");
  }
  return parsedId;
}

// [ ]  게시글 조회 API를 만들어 주세요.
// [ ] `id`, `title`, `content`, `createdAt`를 조회합니다.
export const getArticle = async (req, res) => {
  const { articleId } = req.params;
  const parsedId = parseArticleId(articleId);
  const article = await articleRepository.findById(parsedId);
  if (!article) throw new NotFoundError("Article를 찾을 수 없습니다");
  const isLiked = req.auth?.userId
    ? await articleRepository.isLikedByUser(req.auth.userId, parsedId)
    : false;
  res.json({ success: true, data: article });
};

// [ ]  게시글 등록 API를 만들어 주세요.
// [ ] `title`, `content`를 입력해 게시글을 등록합니다.
export const createArticle = async (req, res) => {
  const article = await articleRepository.create({
    data: req.validatedData,
  });
  res.status(201).json({ success: true, data: article });
};

// [ ]  게시글 수정 API를 만들어 주세요.
export const updateArticle = async (req, res) => {
  const { articleId } = req.params;
  const article = await articleRepository.update({
    where: { id: parseInt(articleId) },
    data: req.validatedData,
  });
  res.json({ success: true, data: article });
};

// [ ]  게시글 삭제 API를 만들어 주세요.
export const deleteArticle = async (req, res) => {
  const { articleId } = req.params;
  await articleRepository.delete({
    where: { id: parseInt(articleId) },
  });
  res.json({ success: true, message: "Article이 삭제되었습니다" });
};

// [ ]  게시글 목록 조회 API를 만들어 주세요.
// [ ] `id`, `title`, `content`, `createdAt`를 조회합니다.
// [ ]  offset 방식의 페이지네이션 기능을 포함해 주세요.
// [ ]  최신순(`recent`)으로 정렬할 수 있습니다.
// [ ] `title`, `content`에 포함된 단어로 검색할 수 있습니다.
export const getArticles = async (req, res) => {
  const { search, sort = "recent", page = "1", limit = "10" } = req.query;
  const where = {};
  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }
  const orderBy = {
    recent: {
      createdAt: "desc",
    },
  }[sort] || {
    createdAt: "desc",
  };
  const pageNum = Math.max(1, parseInt(page) || 1);
  const take = Math.max(1, parseInt(limit) || 10);
  const skip = (pageNum - 1) * take;

  const [articles, total] = await Promise.all([
    articleRepository.findMany({
      where,
      orderBy,
      skip,
      take,

      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    }),

    articleRepository.count({
      where,
    }),
  ]);

  res.json({
    success: true,
    page: pageNum,
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
    data: articles,
  });
};
