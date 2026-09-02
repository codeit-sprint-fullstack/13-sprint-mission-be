import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "상품명은 1자 이상이어야 합니다")
    .max(10, "상품명은 10자 이내여야 합니다"),
  description: z
    .string()
    .min(10, "상품 소개는 10자 이상이어야 합니다")
    .max(100, "상품 소개는 100자 이내여야 합니다"),
  price: z.coerce
    .number()
    .int()
    .nonnegative()
    .min(0, "판매 가격은 0원 이상이어야 합니다"),
  tags: z.array(z.string().max(5, "태그는 5자 이내여야 합니다")).optional(),
});

export const getProductListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  sort: z.enum(["recent", "oldest", "title", "like"]).default("recent"),
  keyword: z.string().default(""),
});

export const updateProductSchema = createProductSchema.partial();
