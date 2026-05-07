// ─────────────────────────────────────────────────────────────
// 실습#7: asyncHandler 패턴 (✅ 완료)
// ─────────────────────────────────────────────────────────────
//
// async 라우트 핸들러를 감싸서 에러를 자동으로 처리해주는 래퍼 함수.
//
// MongoDB 에러 처리:
//   - ValidationError → 400 Bad Request
//   - CastError       → 404 Not Found
//   - 그 외           → 500 Internal Server Error

export const asyncHandler = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        res.status(400).json({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).json({ message: "Cannot find given id." });
      } else {
        res.status(500).json({ message: e.message });
      }
    }
  };
};
