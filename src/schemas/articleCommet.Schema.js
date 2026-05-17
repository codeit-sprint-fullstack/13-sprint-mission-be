import { z } from "zod";

const OPTIONAL_SIZE = {
  content: { min: 1, max: 500 },
};

// 댓글 등록
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(
      OPTIONAL_SIZE.content.min,
      `댓글은 ${OPTIONAL_SIZE.content.min}자 이상이어야 합니다.`,
    )
    .max(
      OPTIONAL_SIZE.content.max,
      `댓글은 ${OPTIONAL_SIZE.content.max}자 이하여야 합니다.`,
    ),
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
