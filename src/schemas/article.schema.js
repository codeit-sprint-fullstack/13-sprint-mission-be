import { z } from "zod";

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, "title은 1자 이상이어야 합니다")
    .max(100, "title은 100자 이하여야 합니다"),
  content: z.string().max(1000, "content는 1000자 이하여야 합니다").optional(),
});

export const updateArticleSchema = createArticleSchema.partial();
