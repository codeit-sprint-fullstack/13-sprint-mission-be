// comment.schema.js
import { z } from "zod";

export const createCommentSchema = z
  .object({
    content: z
      .string()
      .max(1000, "content는 1000자 이하여야 합니다")
      .optional(),
    articleId: z
      .number()
      .int()
      .positive("userId는 양의 정수여야 합니다")
      .optional(),
    productId: z
      .number()
      .int()
      .positive("productId는 양의 정수여야 합니다")
      .optional(),
  })
  .refine((data) => data.articleId || data.productId, {
    message: "articleId 또는 productId 중 하나는 반드시 필요합니다",
  });

export const updateCommentSchema = z.object({
  content: z.string().max(1000, "content는 1000자 이하여야 합니다"),
});
