// product.schema.js
import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "name은 1자 이상이어야 합니다")
    .max(100, "name은 100자 이하여야 합니다"),
  description: z
    .string()
    .max(1000, "content는 1000자 이하여야 합니다")
    .optional(),
  price: z.number().int().positive("가격은 양의 정수여야합니다"),
  tags: z.array(z.string()).default([]),
});

export const updateProductSchema = createProductSchema.partial();
