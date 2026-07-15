import { z } from "zod";

const LIMITS = { content: { min: 1, max: 500 } };

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(LIMITS.content.min, `댓글은 ${LIMITS.content.min}자 이상이어야 합니다.`)
    .max(LIMITS.content.max, `댓글은 ${LIMITS.content.max}자 이하여야 합니다.`),
});

export const updateCommentSchema = createCommentSchema.partial();

export const getCommentsSchema = z.object({
  cursor: z.string().optional(),
  pageSize: z.coerce
    .number()
    .min(1, "페이지 사이즈는 1 이상이어야 합니다.")
    .optional()
    .default(10),
});
