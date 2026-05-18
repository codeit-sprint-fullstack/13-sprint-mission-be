import { z } from "zod";

export const createArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "title은 필수입니다.")
    .max(100, "title은 100자 이하입니다"),

  content: z.string().trim().min(1, "content는 필수입니다."),
});

export const updateArticleSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "title은 비어있을 수 없습니다.")
      .max(100)
      .optional(),

    content: z
      .string()
      .trim()
      .min(1, "content는 비어있을 수 없습니다.")
      .optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "title 또는 content 중 하나는 필요합니다.",
  });

export const articleQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),

  limit: z.coerce.number().int().positive().optional(),

  keyword: z.string().optional(),
});
