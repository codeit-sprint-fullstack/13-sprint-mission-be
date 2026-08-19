import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import HttpError from "../errors/HttpError.js";

// next 는 쓰지 않지만 빼면 안 된다. Express 는 인자 4개인 함수만 에러 핸들러로 인식한다.
const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error.name === "UnauthorizedError") {
    return res.status(401).send("invalid token...");
  }

  const http = error instanceof HttpError ? error : null;
  const zod = error instanceof ZodError ? error : null;
  const status = http?.code ?? (zod ? 400 : 500);
  // 우리가 던진 에러 외에는 메시지를 그대로 내보내지 않는다. Prisma 에러 메시지에
  // 테이블/컬럼명이 그대로 들어 있음.
  const message =
    http?.message ??
    zod?.issues.map((i) => i.message).join(",") ??
    "Internal Server Error";

  console.error(error);
  return res.status(status).json({
    path: req.path,
    method: req.method,
    message,
    data: http?.data,
    date: new Date(),
  });
};

export default errorHandler;
