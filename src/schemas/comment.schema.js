import { z } from "zod";

const contentField = z.string().max(1000, "content는 1000자 이하여야 합니다");

export const createArticleCommentSchema = z.object({
  content: contentField,
});

export const createProductCommentSchema = z.object({
  content: contentField,
});

// PATCH /comments/:commentId 에서 공용으로 사용 (상품/게시글 댓글 구분 없음)
export const updateCommentSchema = z.object({
  content: contentField,
});