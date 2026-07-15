import { z } from "zod";

export const commentIdParamSchema = z.object({
  id: z.coerce.number({ error: "댓글 ID는 숫자여야 합니다." }).int().positive(),
});

export const commentBodySchema = z.object({
  content: z.string({ error: "댓글 내용은 필수입니다." }).trim().min(1, "댓글 내용은 필수입니다."),
});

export const commentListQuerySchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
