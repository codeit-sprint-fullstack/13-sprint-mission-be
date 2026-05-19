/**
 * 전역 에러 처리 미들웨어
 */
const errorHandler = (err, req, res, next) => {
  console.error("🚨 [에러 발생]:", err);

  // 1. Prisma P2025 에러 (Record Not Found)
  if (err.code === "P2025") {
    return res.status(404).json({
      message: err.message || "요청하신 리소스를 찾을 수 없습니다.",
    });
  }

  // 2. Service 로직에서 던진 상태 코드가 있는 커스텀 에러
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  // 3. 그 외 서버 내부 오류 (500)
  res
    .status(500)
    .json({ message: err.customMessage || "서버 내부 오류가 발생했습니다." });
};

module.exports = errorHandler;
