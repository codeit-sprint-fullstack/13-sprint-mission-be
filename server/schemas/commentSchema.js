const { z } = require("zod");

const commentZodSchema = z
  .string({
    required_error: "content는 1자 이상이어야 합니다.",
    invalid_type_error: "content는 1자 이상이어야 합니다.",
  })
  .trim()
  .min(1, "content는 1자 이상이어야 합니다.");

/**
 * 댓글 유효성 검사 스키마
 */
exports.validateComment = (content, isUpdate = false) => {
  // 2. safeParse로 검증
  const result = commentZodSchema.safeParse(content);
  if (!result.success) {
    return result.error.errors[0].message;
  }

  return null;
};
