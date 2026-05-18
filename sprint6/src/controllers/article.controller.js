import prisma from "../lib/prisma.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// 게시글 목록 조회
export const getAllArticles = asyncHandler(async (req, res) => {
  const { search, sort = "recent", page = "1", limit = "10" } = req.query;

  //검색 조건
  //검색할 때 여러 조건 중 하나라도 있으면 내용을 보여준다 (title, content)
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  // 정렬 조건

  const orderBy =
    sort === "recent" // 최신순 정렬
      ? { createdAt: "desc" }
      : { createdAt: "desc" }; //(desc 내림차순)

  // 페이지네이션
  const pageNum = parseInt(page) || 1;
  const take = parseInt(limit) || 10;
  const skip = (pageNum - 1) * take;

  // 게시글 목록, 전체 게시글 수 한번에 가져오기

  const [articles, total] = await Promise.all([
    // Promise.all([]) 비동기 한번에 실행, a,b 둘 다 끝날시 결과값 반환

    //게시글 목록
    prisma.article.findMany({
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

    //조건에 맞는 전체 게시글 수

    prisma.article.count({ where }),
  ]);
  res.json({
    success: true,
    page: pageNum,
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
    data: articles,
  });
});

// 게시글 개별 조회
export const getArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id: parse(id) },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
  if (!article) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  res.json({ seccess: true, data: article });
});

// 게시글 등록
export const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const article = await prisma.article.create({
    data: { title, content },
  });
  res.status(201).json({ success: true, data: article });
});

// 게시글 수정
export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const article = await prisma.article.update({
    where: { id: parseInt(id) },
    data: { title, content },
  });
  if (!article) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  res.json({ success: true, data: article });
});

// 게시글 삭제
export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.article.delete({
    where: { id: [parseInt(id)] },
  });
  res.json({ success: true, message: "게시글이 삭제되었습니다." });
});
