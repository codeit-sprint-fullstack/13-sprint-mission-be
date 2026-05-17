import prisma from "../lib/prisma.js";
import asyncHandler from "../utils/asyncHandler.js";

// 상품 댓글 등록
export const createProductComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await prisma.comment.create({
    data: { content, type: product },
  });
  res.status(201).json({ success: true, data: comment });
});
// 게시글 댓글 등록
export const createArticleComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await prisma.comment.create({
    data: { content, type: article },
  });
  res.status(201).json({ success: true, data: comment });
});

// 상품 댓글 목록 조회
export const getProductComments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comments = await prisma.comment.findMany({
    where: {
      productId: parseInt(id), // 접근한 상품페이지 id인 것만 조회
      type: product,
    },
    include: {
      user: { select: { nickname: true } },
    },
  });

  res
    .status(200)
    .json({ success: true, totalCount: comments.length, data: comments });
});
// 게시글 댓글 목록 조회
export const getArticleComments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comments = await prisma.comment.findMany({
    where: {
      articleId: parseInt(id), // 접근한 게시글페이지 id인 것만 조회
      type: article,
    },
    include: {
      user: { select: { nickname: true } },
    },
  });

  res
    .status(200)
    .json({ success: true, totalCount: comments.length, data: comments });
});

// 댓글 수정
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.comment.update({
    where: { id: parseInt(id) },
    data: req.body,
  });
  res.json({ success: true, data: comment });
});

// 댓글 삭제
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.comment.delete({
    where: { id: parseInt(id) },
  });
  res.json({ success: true, message: "삭제되었습니다" });
});
