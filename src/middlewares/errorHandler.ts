// ============================================================
// Error Handler
// ============================================================

import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";
import { z } from "zod";
import { AppError } from "./errors.js";

/**
 * Express 전역 에러 핸들링 미들웨어
 * 우선순위: express-jwt 인증 에러 → Zod 검증 에러 → Prisma 에러
 * → 커스텀 에러(AppError/ValidationError 등) → 그 외 알 수 없는 에러(500)
 *
 * @param {Error} error - 처리할 에러 객체
 * @param {import("express").Request} req - Express 요청 객체
 * @param {import("express").Response} res - Express 응답 객체
 * @param {import("express").NextFunction} next - Express next 함수 (사용되지 않음)
 * @returns {import("express").Response} 에러 정보를 담은 JSON 응답
 */
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // express-jwt 인증 에러
  if (error.name === "UnauthorizedError") {
    return res
      .status(401)
      .json({ success: false, message: "invalid token..." });
  }

  // Zod 검증 에러 - 컨트롤러 안 schema.parse()가 던진 ZodError 처리
  if (error instanceof z.ZodError) {
    const errors = error.issues;
    return res.status(400).json({
      success: false,
      errors: errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Prisma - 행 없음
  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "데이터를 찾을 수 없습니다",
    });
  }

  // Prisma - UNIQUE 제약 위반
  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "이미 존재하는 데이터입니다",
      field: error.meta?.target,
    });
  }

  // Prisma - 외래 키 제약 위반
  if (error.code === "P2003") {
    return res.status(400).json({
      success: false,
      message: "참조 무결성 제약 조건 위반",
    });
  }

  // Prisma validation 에러 (타입 불일치 등)
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Prisma validation 에러",
      detail: error.message.split("\n").slice(-2).join(" "),
    });
  }

  // 커스텀 에러 (ValidationError 등 AppError를 상속한 에러)
  // 클래스에 담아 둔 status 값을 그대로 사용
  if (error instanceof AppError) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }

  // 그 외 알 수 없는 에러 - 콘솔에 로그 + 500 응답
  console.error(error);
  return res.status(500).json({
    success: false,
    path: req.path,
    method: req.method,
    message:
      process.env.NODE_ENV === "production"
        ? "서버 에러가 발생했습니다"
        : error.message,
    date: new Date(),
  });
};

export default errorHandler;
