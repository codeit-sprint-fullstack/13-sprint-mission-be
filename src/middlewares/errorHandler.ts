// utils/customError.js 와 합침 그리고 utils/ 지움
class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends CustomError {
  constructor(message = "잘못된 요청입니다.") {
    super(400, message);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = "인증이 필요합니다.") {
    super(401, message);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = "권한이 없습니다.") {
    super(403, message);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "리소스를 찾을 수 없습니다.") {
    super(404, message);
  }
}

function errorHandler(err, req, res, next) {
  console.error(err);

  // 우리가 직접 던진 에러 (400/401/403/404 등)
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // express-jwt: Authorization 헤더가 없거나 토큰이 유효하지 않을 때 던지는 에러
  if (err.name === "UnauthorizedError") {
    return res
      .status(err.status || 401)
      .json({ message: "로그인이 필요합니다." });
  }

  // Prisma: update/delete 대상 레코드가 없을 때
  if (err.code === "P2025") {
    return res.status(404).json({ message: "리소스를 찾을 수 없습니다." });
  }

  // Prisma: unique 제약 위반 (예: 이메일 중복, 좋아요 중복)
  if (err.code === "P2002") {
    return res.status(400).json({ message: "이미 존재하는 데이터입니다." });
  }

  // multer 에러 (이미지 개수 초과, 용량 초과, 파일 형식 오류 등)
  if (err.name === "MulterError" || err.message?.includes("이미지 파일만")) {
    return res.status(400).json({ message: err.message });
  }

  // 나머지는 전부 서버 오류(500)로 처리
  return res.status(500).json({ message: "서버 오류가 발생했습니다." });
}

export {
  errorHandler,
  CustomError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
};
