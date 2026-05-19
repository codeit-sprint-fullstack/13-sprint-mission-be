import { z } from "zod";

export const createProductBodySchema = z.object({
  name: z
    .string({ error: "name은 필수입니다" })
    .min(1, "name은 1자 이상이어야 합니다")
    .max(10, "name은 10자 이하여야 합니다"),
  description: z
    .string({ error: "description은 필수입니다" })
    .min(10, "description은 10자 이상이어야 합니다")
    .max(100, "description은 100자 이하여야 합니다"),

  price: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "price는 필수입니다"
          : "price는 숫자여야 합니다",
    })
    .int("price는 정수여야 합니다")
    .positive("price는 양수여야 합니다"),
  tags: z
    .array(
      z
        .string()
        .min(1, "tag는 1자 이상이어야 합니다")
        .max(5, "tag는 5자 이하여야 합니다"),
    )
    .optional(),
});

export const updateProductBodySchema = createProductBodySchema
  .partial()
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    "수정사항이 하나라도 존재해야 합니다",
  );

export const getProductsQuerySchema = z
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

export const productParamsSchema = z.object({
  id: z.coerce
    .number({ error: "id는 숫자여야 합니다" })
    .int("id는 정수여야 합니다")
    .positive("id는 양수여야 합니다"),
});
