const errorHandler = (err, req, res, next) => {
  console.error("서버 에러:", err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      message: err.code === "credentials_required"
        ? "로그인이 필요합니다."
        : "유효하지 않은 토큰입니다.",
    });
  }

  if (err.name === "MulterError") {
    return res.status(400).json({
      message: "이미지 업로드 요청을 확인해 주세요.",
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message =
    statusCode === 500
      ? "서버 내부 오류가 발생했습니다."
      : err.message || "요청을 처리할 수 없습니다.";

  return res.status(statusCode).json({ message });
};

module.exports = errorHandler;
