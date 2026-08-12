// ============================================================
// Validate Middleware
// - zod 스키마로 req.body를 검증하는 미들웨어 팩토리
// ============================================================

import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}
