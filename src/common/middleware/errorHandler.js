import { Prisma } from "@prisma/client";

import { ZodError } from "zod";

export default function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  // express-jwt
  if (error.name === "UnauthorizedError") {
    return res.status(401).json({
      path: req.path,
      method: req.method,
      message: "invalid token...",
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        path: req.path,
        method: req.method,
        message: "이미 존재하는 데이터입니다",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        path: req.path,
        method: req.method,
        message: "리소스를 찾을 수 없습니다",
      });
    }
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      path: req.path,
      method: req.method,
      message: "입력 데이터가 올바르지 않습니다",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const status = error.status ?? 500;

  console.error(error);

  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: status === 500 ? "Internal Server Error" : error.message,
  });
}
