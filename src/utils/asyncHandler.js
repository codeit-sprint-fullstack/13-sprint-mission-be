import { Prisma } from "@prisma/client";
import { HttpError } from "./error.js";

export const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (err) {
    //우리가 직접 던진 HTTP 에러 400,404 같은
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "리소스가 없다..",
        });
      }

      if (err.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "이미 존재하는 데이터임",
          field: err.meta?.target,
        });
      }
      //예를 들면 없는 productId로 댓글을 생성하려 할 때 발생
      if (err.code === "P2003") {
        return res.status(400).json({
          success: false,
          message: "참조 무결성 제약 조건 위반",
        });
      }
    }

    //유효성 에러 잘못된 데이터 보냈으니 400에러
    if (err instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({
        success: false,
        message: "Prisma validation 에러",
        detail: err.message.split("\n").slice(-2).join(" "),
      });
    }

    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "올바른 데이터형식 아님",
      });
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: "서버 에러가 발생했습니다",
    });
  }
};
