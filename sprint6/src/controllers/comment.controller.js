import prisma from "../lib/prisma.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// 자유게시판 댓글 등록

export const createArticleComment = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;

  const article = await prisma.article.findUnique({
    where: { id: parseInt(articleId) },
  });

  if (!article) {
    return res.status(404).json({
      success: false,
      message: "게시글을 찾을 수 없습니다.",
    });
  }
  const comment = await prisma.comment.create({
    data: { content, articleId: parseInt(articleId) },
  });
  res.status(201).json({ success: true, data: comment });
});

// 자유게시판 댓글 목록 조회

export const getAllArticleComments = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

  const cursorOption = cursor ? { cursor: { id: cursor }, skip: 1 } : {};

  const comment = await prisma.comment.findMany({
    where: { articleId: parseInt(articleId) },
    select: { id: true, content: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    ...cursorOption,
  });

  const nextCursor =
    comment.length === limit ? comment[comment.length - 1].id : null;
  res.json({
    success: true,
    nextCursor,
    data: comment,
  });
});

///댓글 수정
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const comment = await prisma.comment.update({
    where: { id: parseInt(id) },
    data: { content },
  });
  res.json({ success: true, data: comment });
});

//댓글 삭제
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.comment.delete({
    where: { id: parseInt(id) },
  });
  res.json({ success: true, message: "댓글이 삭제되었습니다." });
});
