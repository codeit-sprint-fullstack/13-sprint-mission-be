import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "최소 1자 이상이어야 합니다")
    .max(10, "10자 이내로 입력해주세요"),
  description: z
    .string()
    .min(10, "최소 10자 이상 입력해주세요")
    .max(100, "100자 이내로 입력해주세요"),
  price: z.number().int("숫자로 입력해주세요"),
  tags: z.array(z.string().max(5, "5글자 이내로 입력해주세요")).default([]),
  images: z.array(z.string()).default([]),
  ownerId: z.number().int().default(1),
});
