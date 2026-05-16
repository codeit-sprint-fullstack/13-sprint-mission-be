import { z } from "zod";

export const idParamShcema = z.object({
  id: z.coerce.number().int().positive("유효한 id가 아닙니다."),
});

export const commentIdParamSchema = z.object({
  commentId: z.coerce.number().int().positive("유효한 commentId가 아닙니다"),
});

export const articleIdParamSchema = z.object({
  articleId: z.coerce.number().int().positive("유효한 articleId가 아닙니다."),
});

export const productIdParamSchema = z.object({
  productId: z.coerce.number().int().positive("유효한 productId가 아닙니다."),
});
