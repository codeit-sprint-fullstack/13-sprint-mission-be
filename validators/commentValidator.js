import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, "댓글 내용을 입력해주세요."),
});

export const updateCommentSchema = createCommentSchema.partial();
