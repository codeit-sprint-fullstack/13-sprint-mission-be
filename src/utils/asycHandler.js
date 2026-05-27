import { z } from "zod";
import { AppError } from "./errors.js";

export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          errors: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }

      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "데이터를 찾을 수 없습니다",
        });
      }

      if (err instanceof AppError) {
        return res.status(err.status).json({
          success: false,
          message: err.message,
        });
      }

      // 4) 그 외 알 수 없는 에러 — 콘솔에 로그 + 500 응답
      console.error(err);
      res.status(500).json({
        success: false,
        message: "서버 에러가 발생했습니다",
      });
    }
  };
};
