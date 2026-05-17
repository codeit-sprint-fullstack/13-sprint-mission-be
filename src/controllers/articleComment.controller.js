// ============================================================
// ArticleComment 컨트롤러
// - 모든 컨트롤러는 asyncHandler 로 감싸져 있어 try/catch 가 필요 없음
// - 에러는 asyncHandler 가 종류별로 알아서 처리
// ============================================================

import prisma from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../schemas/comment.schema.js";

// GET /articles/:articleId/comments
export const getAllArticleComments = asyncHandler(async (req, res) => {
  const { orderBy = "recent", limit = 10, cursor = null } = req.query;
  const { articleId } = req.params;

  // article 댓글만 가져오기
  const parsedArticleId = parseInt(articleId);
  const whereCondition = {
    articleId: !isNaN(parsedArticleId) ? parsedArticleId : undefined,
    productId: null,
  };

  if (isNaN(parsedArticleId)) {
    throw new ValidationError("유효한 게시글 ID가 아닙니다");
  }

  // 댓글 존재 확인
  const commentCount = await prisma.comment.count({
    where: whereCondition,
  });

  if (commentCount === 0) {
    throw new NotFoundError(
      `게시글 ID가 '${parsedArticleId}'인 댓글을 찾을 수 없습니다`,
    );
  }

  const sortOption = {
    recent: { createdAt: "desc" },
  }[orderBy] || { createdAt: "desc" };

  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const cursorId = parseInt(cursor) || null;

  const [data, totalItems] = await Promise.all([
    prisma.comment.findMany({
      where: whereCondition,
      take: pageSize + 1,
      ...(cursorId && {
        skip: 1,
        cursor: {
          id: cursorId,
        },
      }),
      orderBy: sortOption,
    }),
    prisma.comment.count({ where: whereCondition }),
  ]);

  const hasNextPage = data.length > pageSize;
  const newData = hasNextPage ? data.slice(0, pageSize) : data;
  const nextCursor = hasNextPage ? newData[newData.length - 1].id : null;

  res.json({
    data: newData,
    pagination: {
      totalItems,
      hasNextPage,
      nextCursor,
    },
  });
});

// POST /articles/:articleId/comments
export const createArticleComment = asyncHandler(async (req, res) => {
  const data = createCommentSchema.parse(req.body); // 유효성 검사 완료된 데이터
  const { articleId } = req.params;
  const { content } = data;

  // 생성
  const comment = await prisma.comment.create({
    data: {
      content,
      articleId: parseInt(articleId),
    },
  });

  res.status(201).json({ success: true, data: comment });
});

// PATCH /articles/:articleId/comments/:commentId
export const updateArticleComment = asyncHandler(async (req, res) => {
  const { articleId, commentId } = req.params;
  const data = updateCommentSchema.parse(req.body); // 유효성 검사 완료된 데이터
  const { content } = data;

  // comment 존재 확인
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId) },
  });

  if (!comment) {
    throw new NotFoundError(`${commentId} 댓글을 찾을 수 없습니다`);
  }

  // 해당 게시글의 comment인지 확인
  if (comment.articleId !== parseInt(articleId)) {
    throw new ValidationError(`${articleId} 게시글의 댓글이 아닙니다`);
  }

  // 수정
  await prisma.comment.update({
    where: { id: parseInt(commentId) },
    data: {
      content,
      articleId: parseInt(articleId),
    },
  });

  res.json({ success: true, data: comment });
});

// DELETE /articles/:articleId/comments/:commentId
export const deleteArticleComment = asyncHandler(async (req, res) => {
  const { commentId, articleId } = req.params;

  // comment 존재 확인
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId) },
  });

  if (!comment) {
    throw new NotFoundError(`${commentId} 댓글을 찾을 수 없습니다`);
  }

  // 해당 게시글의 comment인지 확인
  if (comment.articleId !== parseInt(articleId)) {
    throw new ValidationError(`${articleId} 게시글의 댓글이 아닙니다`);
  }

  // 삭제
  await prisma.comment.delete({
    where: { id: parseInt(commentId) },
  });

  res.json({ success: true, message: "댓글이 삭제되었습니다" });
});
