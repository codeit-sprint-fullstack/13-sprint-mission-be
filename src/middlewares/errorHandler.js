import { z } from "zod";

export default function errorHandler(err, req, res, next) {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err.isOperational) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "데이터를 찾을 수 없습니다.",
    });
  }

  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "이미 존재하는 데이터입니다.",
    });
  }

  if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "인증이 필요합니다.",
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "서버 에러가 발생했습니다.",
  });
}
