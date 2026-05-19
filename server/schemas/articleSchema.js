const { z } = require("zod");

const articleZodSchema = z.object({
  title: z
    .string()
    .min(1, "title은 1자 이상, 10자 이내여야 합니다.")
    .max(10, "title은 1자 이상, 10자 이내여야 합니다."),
  content: z
    .string()
    .min(10, "content는 10자 이상, 100자 이내여야 합니다.")
    .max(100, "content는 10자 이상, 100자 이내여야 합니다."),
});

/**
 * 게시글 유효성 검사 스키마
 */
exports.validateArticle = (data) => {
  //safeParse를 사용해 데이터를 검증(에러를 던지지 않고 객체를 반환)
  const result = articleZodSchema.safeParse(data);
  if (!result.success) {
    // 검증에 실패하면 첫 번째 에러 메시지를 꺼내서 반환합니다.
    return result.error.errors[0].message;
  }

  return null;
};
