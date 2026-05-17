// ============================================
// Comment Zod 스키마
// - Product, Article 공통 사용
// ============================================

import { z } from "zod";

// 생성 스키마 (사용자 입력)
export const createCommentSchema = z.object({
  content: z.string().min(1, "content는 1자 이상이어야 합니다").trim(),
  productId: z.number().int().optional(),
  articleId: z.number().int().optional(),
});

export const updateCommentSchema = createCommentSchema.partial();
