import { z } from "zod";

const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "상품명은 1자 이상이어야 합니다")
    .max(10, "상품명은 10자 이하여야 합니다"),
  description: z
    .string()
    .min(10, "상품 소개는 10자 이상이어야 합니다")
    .max(100, "상품 소개는 100자 이하여야 합니다"),
  price: z.number().min(1, "판매 가격은 1자 이상이어야 합니다"),
  favoriteCount: z.number().optional().default(0),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "상품명은 1자 이상이어야 합니다")
    .max(10, "상품명은 10자 이하여야 합니다"),
  description: z
    .string()
    .min(10, "상품 소개는 10자 이상이어야 합니다")
    .max(100, "상품 소개는 100자 이하여야 합니다"),
  price: z.number().min(1, "판매 가격은 1자 이상이어야 합니다"),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export default createProductSchema;
