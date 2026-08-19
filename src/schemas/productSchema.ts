import z from "zod";

// default 는 create 에만 붙인다. update 스키마가 partial 로 상속하면
// 빠뜨린 필드가 [] 로 덮여써지기 때문.
const productFields = {
  name: z
    .string()
    .min(1, "상품명을 입력해주세요.")
    .max(10, "10자 이내로 입력해주세요."),
  description: z.string().min(10, "10자 이상 입력해주세요."),
  price: z.number("숫자로 입력해주세요.").int().positive(),
  tags: z.array(z.string().max(5, "5글자 이내로 입력해주세요.")),
  images: z.array(z.string()),
};

export const productCreateSchema = z.object({
  ...productFields,
  tags: productFields.tags.optional().default([]),
  images: productFields.images.optional().default([]),
});

export const productUpdateSchema = z.object(productFields).partial();
