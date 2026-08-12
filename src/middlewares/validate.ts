import { RequestHandler } from "express";
import z, { ZodType } from "zod";
import HttpError from "../errors/HttpError.js";

const idSchema = z.coerce.number().int().positive();

// req.params 는 항상 string 이라 경계에서 한 번만 number 로 바꾼다.
// 아래 레이어(service/repository)는 number 만 받는다.
export function parseId(value: unknown, label = "id"): number {
  const result = idSchema.safeParse(value);
  if (!result.success) {
    throw new HttpError(`올바른 ${label}가 아닙니다.`, 400);
  }
  return result.data;
}

export default function validate(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(",");
      return next(new HttpError(message, 400));
    }
    req.body = result.data;
    next();
  };
}
