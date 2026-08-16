import { z } from "zod";

const OPTIONAL_SIZE = {
  name: { min: 1, max: 10 },
  description: { min: 10, max: 100 },
  tag: { max: 5 },
};

export const createProductSchema = z.object({
  name: z
    .string()
    .min(OPTIONAL_SIZE.name.min, "상품명은 1자 이상이어야 합니다.")
    .max(OPTIONAL_SIZE.name.max, "상품명은 10자 이하여야 합니다."),
  description: z
    .string()
    .min(OPTIONAL_SIZE.description.min, "상품설명은 10자 이상이어야 합니다.")
    .max(OPTIONAL_SIZE.description.max, "상품설명은 100자 이하여야 합니다."),
  price: z
    .number({ error: "가격은 숫자여야 합니다." })
    .min(0, "가격은 0 이상이어야 합니다."),
  tags: z
    .array(z.string().max(OPTIONAL_SIZE.tag.max, "태그는 5자 이하여야 합니다."))
    .optional()
    .default([]),
  images: z.array(z.string()).optional().default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const getProductsSchema = z.object({
  page: z.coerce
    .number()
    .min(1, "페이지는 1 이상이어야 합니다.")
    .optional()
    .default(1),
  pageSize: z.coerce
    .number()
    .min(1, "페이지 사이즈는 1 이상이어야 합니다.")
    .optional()
    .default(10),
  orderBy: z
    .enum(["recent", "oldest"], {
      error: "정렬 방식이 올바르지 않습니다.",
    })
    .optional()
    .default("recent"),
  keyword: z.string().optional().default(""),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductsQuery = z.infer<typeof getProductsSchema>;
export type ProductOrderBy = GetProductsQuery["orderBy"];
