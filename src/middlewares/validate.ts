import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validate =
  <T extends ZodType>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

export const validateQuery =
  <T extends ZodType>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
