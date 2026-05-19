import { z } from "zod";

export const createArticleBodySchema = z.object({
  title: z
    .string("title은 필수입니다")
    .min(1, "title은 1자 이상이어야 합니다")
    .max(10, "title은 10자 이하여야 합니다"),
  content: z
    .string("content는 필수입니다")
    .min(10, "content는 10자 이상이어야 합니다")
    .max(1000, "content는 1000자 이하여야 합니다"),
});

export const updateArticleBodySchema = createArticleBodySchema
  .partial()
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    "수정사항이 하나라도 존재해야 합니다",
  );

export const getArticlesQuerySchema = z
  .object({
    keyword: z.string(),
    page: z.coerce
      .number({ error: "page는 숫자여야 합니다" })
      .int("page는 정수여야 합니다")
      .positive("page는 양수여야 합니다"),
    limit: z.coerce
      .number({ error: "limit는 숫자여야 합니다" })
      .int("limit는 정수여야 합니다")
      .positive("limit는 양수여야 합니다"),
    sort: z.enum(
      ["recent", "oldest"],
      "sort는 'recent' 또는 'oldest'여야 합니다",
    ),
  })
  .partial();

export const articleParamsSchema = z.object({
  id: z.coerce
    .number({ error: "id는 숫자여야 합니다" })
    .int("id는 정수여야 합니다")
    .positive("id는 양수여야 합니다"),
});
