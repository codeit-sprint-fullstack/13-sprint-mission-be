import { z } from "zod";

export const productIdParamSchema = z.object({
  id: z.coerce.number({ error: "상품 ID는 숫자여야 합니다." }).int().positive(),
});

export const productListQuerySchema = z.object({
  keyword: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.enum(["recent", "favorite"]).optional(),
});

export const createProductSchema = z.object({
  name: z.string({ error: "상품명은 필수입니다." }).trim().min(1, "상품명은 필수입니다."),
  description: z.string({ error: "상품 설명은 필수입니다." }).trim().min(1, "상품 설명은 필수입니다."),
  price: z.coerce
    .number({ error: "가격은 숫자여야 합니다." })
    .int("가격은 정수여야 합니다.")
    .min(0, "가격은 0 이상이어야 합니다."),
  tags: z.array(z.string().trim().min(1)).optional(),
  images: z.array(z.string().trim().url()).max(3, "이미지는 최대 3장까지 가능합니다.").optional(),
});

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    price: z.coerce.number().int().min(0).optional(),
    tags: z.array(z.string().trim().min(1)).optional(),
    images: z.array(z.string().trim().url()).max(3).optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    "수정할 내용이 하나라도 있어야 합니다."
  );

// zod 스키마로부터 바로 타입을 추론 (Union·Generics 대신 zod 쪽에서 만드는 타입 안전성 확보)
export type ProductIdParam = z.infer<typeof productIdParamSchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
