import { BadRequestError } from "./errorHandler.js";

// 요구사항(상품 등록): "상품 등록 시 필요한 필드(이름, 설명, 가격 등)의
// 유효성을 검증하는 미들웨어를 구현합니다."
// 요구사항(자유게시판): "게시물 등록 시 필요한 필드(제목, 내용 등)의
// 유효성 검증하는 미들웨어를 구현합니다."
// -> zod 스키마를 인자로 받아 req.body를 검증하는 미들웨어 팩토리
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return next(new BadRequestError(message));
    }
    req.body = result.data;
    next();
  };
}
