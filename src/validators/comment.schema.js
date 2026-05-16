import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, "content는 필수입니다."),
});

export const updateCommentSchema = z.object({
  content: z.string().trim().min(1, "content는 필수입니다."),
});
