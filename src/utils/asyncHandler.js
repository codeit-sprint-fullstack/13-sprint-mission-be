import { Prisma } from "@prisma/client";
import { HttpError } from "./errors.js";
import { z } from "zod";

const asyncHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      // HttpError
      if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }

      // zodError
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "입력 데이터가 올바르지 않습니다",
          error: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      if (error.name === "ZodError") {
        return res.status(400).json({ success: false, errors: error.errors });
      }

      // PrismaError
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return res.status(404).json({
            success: false,
            message: "찾을 수 없는 리소스",
          });
        }
        if (error.code === "P2002") {
          return res.status(409).json({
            success: false,
            message: "이미 존재하는 데이터",
            field: error.meta?.target,
          });
        }
        if (error.code === "P2003") {
          return res.status(400).json({
            success: false,
            message: "참조 무결성 제약 조건 위반",
          });
        }
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
          success: false,
          message: "필수 관계 위반",
        });
      }

      // 500
      console.error(error);
      res.status(500).json({
        success: false,
        message: "서버 에러",
      });
    }
  };
};

export default asyncHandler;
