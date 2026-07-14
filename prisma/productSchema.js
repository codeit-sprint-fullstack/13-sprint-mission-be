import z from "zod";

export const productCreateSchema = z.object({
  name: z
    .string()
    .min(1, "상품명을 입력해주세요.")
    .max(10, "10자 이내로 입력해주세요."),
  description: z.string().min(10, "10자 이상 입력해주세요."),
  price: z.number("숫자로 입력해주세요.").int().positive(),
  tags: z
    .array(z.string().max(5, "5글자 이내로 입력해주세요."))
    .optional()
    .default([]),

  images: z.array(z.string()).optional().default([]),
});
