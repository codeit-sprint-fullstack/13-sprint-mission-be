import { z } from "zod";

export const postProductSchema = z.object({
  name: z
    .string()
    .min(1, "상품 이름은 1자 이상이어야 합니다")
    .max(100, "상품 이름은 100자 이하이어야 합니다"),
  price: z.number().int().min(1, "상품 가격은 1원 이상이어야 합니다"),
  //req.body는 json이면 이미 숫자로 파싱되어 coerce 필요없음
  description: z
    .string()
    .min(1, "상품 설명은 1자 이상이어야 합니다")
    .max(1000, "상품 설명은 1000자 이하이어야 합니다"),
  tags: z.array(z.string()).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  price: z.number().int().min(1).optional(),
  description: z.string().min(1).max(1000),
  tags: z.array(z.string()).optional(),
});

export const productIdSchema = z.object({
  id: z.coerce.number().int().positive(),
  //.positive는 양수만 허용함
});

export const getProductSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sort: z.string().optional(),
  keyword: z.string().optional(),
});
