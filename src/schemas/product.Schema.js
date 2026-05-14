import { z } from "zod";

const OPTIONAL_SIZE = {
  name: { min: 1, max: 10 },
  description: { min: 10, max: 100 },
  tag: { max: 5 },
};

export const createProductSchema = z.object({
  name: z
    .string()
    .min(OPTIONAL_SIZE.name.min, "상품명은 1자 이상이어야 합니다.")
    .max(OPTIONAL_SIZE.name.max, "상품명은 10자 이하여야 합니다."),
  description: z
    .string()
    .min(OPTIONAL_SIZE.description.min, "상품설명은 10자 이상이어야 합니다.")
    .max(OPTIONAL_SIZE.description.max, "상품설명은 100자 이하여야 합니다."),
  price: z
    .number({ invalid_type_error: "가격은 숫자여야 합니다." })
    .min(0, "가격은 0 이상이어야 합니다."),
  tags: z
    .array(z.string().max(OPTIONAL_SIZE.tag.max, "태그는 5자 이하여야 합니다."))
    .optional(),
});
