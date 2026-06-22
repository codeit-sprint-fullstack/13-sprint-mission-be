import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "comment는 1자 이상이어야 합니다")
    .max(100, "comment는 100자 이하여야 합니다."),
});

export const updateCommentSchema = createCommentSchema.partial();
