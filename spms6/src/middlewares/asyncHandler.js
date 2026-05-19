import { Prisma } from "@prisma/client";
import {
  BadRequestError,
  ForeignKeyConstraintError,
  HttpError,
  InternalServerError,
  NotFoundError,
} from "./CustomError.js";
import { ZodError } from "zod";

const sendInternalError = (res) => {
  const internalServerError = new InternalServerError();
  return res.status(internalServerError.statusCode).json({
    message: internalServerError.message,
  });
};

export const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        const notFoundError = new NotFoundError();
        return res.status(notFoundError.statusCode).json({
          message: notFoundError.message,
        });
      } else if (error.code === "P2002") {
        const badRequestError = new BadRequestError(
          "이미 존재하는 데이터 입니다",
        );
        return res.status(badRequestError.statusCode).json({
          message: badRequestError.message, //사실 그냥 직접 입력해도 되지만 커스텀에러 쓰고싶엇음
        });
      } else if (error.code === "P2003") {
        const foreignKeyConstraintError = new ForeignKeyConstraintError();
        return res
          .status(foreignKeyConstraintError.statusCode)
          .json({ message: foreignKeyConstraintError.message });
      } else {
        return sendInternalError(res);
      }
    } else if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.issues[0].message,
      });
    } else {
      return sendInternalError(res);
    }
  }
};
