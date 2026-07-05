// ============================================================
// Validate Middleware
// - zod 스키마로 req.body를 검증하는 미들웨어 팩토리
// ============================================================

export function validate(schema) {
  return (req, res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
}
