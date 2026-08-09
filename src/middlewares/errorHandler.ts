import { ErrorRequestHandler } from "express";

// utils/customError.js 와 합침 그리고 utils/ 지움
class CustomError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
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

// express-jwt / Prisma / multer 등 외부 라이브러리가 던지는 에러는 우리가 타입을
// 통제할 수 없어서, 여기서 실제로 쓰는 필드만 가진 형태로 좁혀서 사용
interface KnownErrorShape {
  name?: string;
  code?: string;
  status?: number;
  message?: string;
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  // 우리가 직접 던진 에러 (400/401/403/404 등)
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  const knownErr = err as KnownErrorShape;

  // express-jwt: Authorization 헤더가 없거나 토큰이 유효하지 않을 때 던지는 에러
  if (knownErr.name === "UnauthorizedError") {
    return res
      .status(knownErr.status || 401)
      .json({ message: "로그인이 필요합니다." });
  }

  // Prisma: update/delete 대상 레코드가 없을 때
  if (knownErr.code === "P2025") {
    return res.status(404).json({ message: "리소스를 찾을 수 없습니다." });
  }

  // Prisma: unique 제약 위반 (예: 이메일 중복, 좋아요 중복)
  if (knownErr.code === "P2002") {
    return res.status(400).json({ message: "이미 존재하는 데이터입니다." });
  }

  // multer 에러 (이미지 개수 초과, 용량 초과, 파일 형식 오류 등)
  if (knownErr.name === "MulterError" || knownErr.message?.includes("이미지 파일만")) {
    return res.status(400).json({ message: knownErr.message });
  }

  // 나머지는 전부 서버 오류(500)로 처리
  return res.status(500).json({ message: "서버 오류가 발생했습니다." });
};

export {
  errorHandler,
  CustomError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
};
