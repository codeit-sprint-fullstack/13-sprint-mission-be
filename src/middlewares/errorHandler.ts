import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Prisma } from "../lib/prisma";
import { isHttpError } from "../utils/httpError";

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      success: false,
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  if (isHttpError(err)) {
    res.status(err.status).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "데이터를 찾을 수 없습니다.",
      });
      return;
    }

    if (err.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "이미 존재하는 데이터입니다.",
      });
      return;
    }
  }

  if (err instanceof Error && (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError")) {
    res.status(401).json({
      success: false,
      message: "인증이 필요합니다.",
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: "서버 에러가 발생했습니다.",
  });
}
