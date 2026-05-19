const { z } = require("zod");

const productZodSchema = z
  .object({
    name: z.string().optional(),
    title: z.string().optional(),
    description: z
      .string({
        required_error: "상품 소개는 10자 이상, 100자 이내여야 합니다.",
        invalid_type_error: "상품 소개는 10자 이상, 100자 이내여야 합니다.",
      })
      .trim()
      .min(10, "상품 소개는 10자 이상, 100자 이내여야 합니다.")
      .max(100, "상품 소개는 10자 이상, 100자 이내여야 합니다."),
    price: z.any().refine((val) => {
      return (
        val !== undefined &&
        val !== null &&
        String(val).trim() !== "" &&
        !isNaN(Number(val))
      );
    }, "판매 가격은 1자 이상의 숫자여야 합니다."),
    tags: z
      .array(
        z
          .string({ invalid_type_error: "태그는 5글자 이내여야 합니다." })
          .max(5, "태그는 5글자 이내여야 합니다."),
      )
      .optional(),
  })
  .refine(
    (data) => {
      // name과 title 중 하나를 타겟으로 하여 유효성 검사
      const targetName = data.title || data.name;
      return (
        targetName &&
        typeof targetName === "string" &&
        targetName.trim().length >= 1 &&
        targetName.length <= 10
      );
    },
    {
      message: "상품명은 1자 이상, 10자 이내여야 합니다.",
    },
  );

/**
 * 상품 유효성 검사 스키마
 */
exports.validateProduct = (data) => {
  // safeParse를 사용해 데이터를 검증
  const result = productZodSchema.safeParse(data);
  if (!result.success) {
    return result.error.errors[0].message;
  }

  return null;
};
