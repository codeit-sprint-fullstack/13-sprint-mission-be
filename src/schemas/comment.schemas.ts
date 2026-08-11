// ============================================
// Comment Zod 스키마
// ============================================

import { z } from "zod";

/** 댓글 등록 스키마
 * @ content
 */
export const createCommentSchema = z.object({
  content: z.string().min(1, "content는 1자 이상이어야 합니다").trim(),
});

/** 댓글 수정 스키마
 * @ content
 */
export const updateCommentSchema = createCommentSchema.partial();
