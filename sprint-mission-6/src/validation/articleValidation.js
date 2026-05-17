import { z } from "zod";

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, "title 은 1자 이상이어야 합니다")
    .max(100, "title 은 100자 이하여야 합니다"),
  content: z.string().max(1000, "content 는 1000자 이하여야 합니다").optional(),
});

export const updateArticleSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().max(1000).optional(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
  // coerce: 문자열을 숫자로 자동 변환 (req.params 는 항상 문자열)
});

// ------------------------------------------아직 적용안함
