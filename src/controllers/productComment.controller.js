// ============================================================
// ProductComment 컨트롤러
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

// GET /items/:productId/comments
export const getAllProductComments = asyncHandler(async (req, res) => {
  const { orderBy = "recent", limit = 10, cursor = null } = req.query;
  const { productId } = req.params;

  // product 댓글만 가져오기
  const parsedProductId = parseInt(productId, 10);
  const whereCondition = {
    productId: !isNaN(parsedProductId) ? parsedProductId : undefined,
    articleId: null,
  };

  if (isNaN(parsedProductId)) {
    throw new ValidationError("유효한 상품 ID가 아닙니다");
  }

  // 댓글 존재 확인
  const commentCount = await prisma.comment.count({
    where: whereCondition,
  });

  if (commentCount === 0) {
    throw new NotFoundError(
      `상품 ID가 '${parsedProductId}'인 댓글을 찾을 수 없습니다`,
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

// POST /items/:productId/comments
export const createProductComment = asyncHandler(async (req, res) => {
  const data = createCommentSchema.parse(req.body); // 유효성 검사 완료된 데이터
  const { productId } = req.params;
  const { content } = data;

  // 생성
  const comment = await prisma.comment.create({
    data: {
      content,
      productId: parseInt(productId),
    },
  });

  res.status(201).json({ success: true, data: comment });
});

// PATCH /items/:productId/comments/:commentId
export const updateProductComment = asyncHandler(async (req, res) => {
  const { productId, commentId } = req.params;
  const data = updateCommentSchema.parse(req.body); // 유효성 검사 완료된 데이터
  const { content } = data;

  // comment 존재 확인
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId) },
  });

  if (!comment) {
    throw new NotFoundError(`${commentId} 댓글을 찾을 수 없습니다`);
  }

  // 해당 상품의 comment인지 확인
  if (comment.productId !== parseInt(productId)) {
    throw new ValidationError(`${productId} 상품의 댓글이 아닙니다`);
  }

  // 수정
  await prisma.comment.update({
    where: { id: parseInt(commentId) },
    data: {
      content,
      productId: parseInt(productId),
    },
  });

  res.json({ success: true, data: comment });
});

// DELETE /items/:productId/comments/:commentId
export const deleteProductComment = asyncHandler(async (req, res) => {
  const { commentId, productId } = req.params;

  // comment 존재 확인
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(commentId) },
  });

  if (!comment) {
    throw new NotFoundError(`${commentId} 댓글을 찾을 수 없습니다`);
  }

  // 해당 상품의 comment인지 확인
  if (comment.productId !== parseInt(productId)) {
    throw new ValidationError(`${productId} 상품의 댓글이 아닙니다`);
  }

  // 삭제
  await prisma.comment.delete({
    where: { id: parseInt(commentId) },
  });

  res.json({ success: true, message: "댓글이 삭제되었습니다" });
});
