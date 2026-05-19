import { z } from "zod";

export const postArticleSchema = z.object({
  title: z
    .string()
    .min(1, "제목은 1자 이상이어야 합니다")
    .max(100, "제목은 100자 이하이어야 합니다"),
  content: z
    .string()
    .min(1, "내용은 1자 이상이어야 합니다")
    .max(1000, "내용은 1000자 이하이어야 합니다"),
});

export const updateArticleSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).max(1000).optional(),
});

export const articleIdSchema = z.object({
  id: z.coerce.number().int().positive(),
  //int()로 소수점은 거르기
});
