import { z } from "zod";

export const getArticleCommentsSchema = z.object({
  limit: z.coerce.number().int().positive().default(3),
  cursor: z.coerce.number().int().positive().optional(),
});

export const articleIdSchema = z.object({
  articleId: z.coerce.number().int().positive().optional(),
});

export const postArticleCommentSchema = z.object({
  content: z
    .string()
    .min(1, "댓글은 1자 이상이어야합니다")
    .max(100, "100자 이내로 작성해야합니다"),
});

export const updataArticleCommentSchema = z.object({
  content: z.string().min(1).max(100).optional(),
});
