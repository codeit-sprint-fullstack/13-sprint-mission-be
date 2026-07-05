// ============================================
// Product Zod 스키마
// ============================================

import { z } from "zod";

/** 상품 등록 스키마
 * @ image, name, price, description, tags
 */
export const createProductSchema = z.object({
  images: z
    .array(z.url({ message: "유효한 이미지 URL을 입력해주세요." }))
    .max(1, { message: "이미지는 최대 1개까지 등록할 수 있습니다." }),
  name: z
    .string()
    .min(1, "name은 1자 이상이어야 합니다")
    .max(10, "name은 10자 이내로 입력해주세요")
    .trim(),
  price: z.coerce
    .number()
    .int("price는 정수여야 합니다")
    .nonnegative("price는 0 이상이어야 합니다")
    .default(0),
  description: z.string().min(1, "description은 1자 이상이어야 합니다").trim(),
  tags: z
    .array(
      z
        .string()
        .min(1, "tag는 1자 이상이어야 합니다")
        .max(5, "tag는 5자 이내로 입력해주세요")
        .trim(),
    )
    .min(1, "최소 1개의 태그가 필요합니다"),
});

/** 상품 수정 스키마
 * @ image, name, price, description, tags
 */
export const updateProductSchema = createProductSchema.partial();
