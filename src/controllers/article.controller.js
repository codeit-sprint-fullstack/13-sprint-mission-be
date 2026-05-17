import prisma from "../lib/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

// 게시글 등록
export const postArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const article = await prisma.article.create({
    data: { title, content },
  });
  res.status(201).json({ success: true, data: article });
});

// 게시글 목록 조회
export const getAllArticles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = "recent", search = "" } = req.query;

  // 검색
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }

  // 정렬
  const sort = { recent: { createdAt: "desc" } };

  // 페이지네이션
  const pageNum = Number(page) || 1;
  const take = Number(limit) || 10;
  const skip = (pageNum - 1) * take;

  // 데이터, 총 갯수
  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: { select: { name: true } },
      },
    }),
    prisma.article.count({ where }),
  ]);

  res
    .status(200)
    .json({ success: true, totalCount: articles.length, data: articles });
});

// 게시글 상세 페이지 조회
export const getArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { name: true } },
    },
  });

  if (!article) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
  res.status(200).json({
    success: true,
    data: article,
  });
});

// 게시글 수정
export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.update({
    where: { id: parseInt(id) },
    select: { title: true, content: true },
    data: req.body,
  });
  res.status(200).json({ success: true, data: article });
});

// 게시글 삭제
export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.article.delete({
    where: { id: parseInt(id) },
  });
  res.json({ success: true, message: "삭제되었습니다" });
});
