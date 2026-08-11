import { ErrorRequestHandler } from "express";
import { AppError } from "../types/AppError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res
      .status(err.code ?? 500)
      .json({ success: false, message: err.message });
    return;
  }

  console.error(err);
  res
    .status(500)
    .json({ success: false, message: "서버 내부 오류가 발생했습니다" });
};
