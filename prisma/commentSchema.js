import z from "zod";

export const commentCreateSchema = z
  .object({
    content: z.string().min(1, "댓글 내용을 입력해주세요."),
    productId: z.number().int().positive().optional(),
    articleId: z.number().int().positive().optional(),
  })
  .refine((data) => Boolean(data.productId) !== Boolean(data.articleId), {
    message: "productId 또는 articleId 중 하나만 입력해주세요.",
  });
