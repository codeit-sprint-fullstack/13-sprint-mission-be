import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

const JWT_SECRET = process.env.JWT_SECRET || "panda-market-secret-key-1234";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error: AppError = new Error("로그인이 필요한 서비스입니다.");
      error.statusCode = 401; // 401 Unauthorized
      throw error;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };

    req.user = decoded;

    next();
  } catch (err: any) {
    const error: AppError = new Error(
      err.name === "TokenExpiredError"
        ? "토큰이 만료되었습니다. 다시 로그인해 주세요."
        : "유효하지 않은 토큰입니다.",
    );
    error.statusCode = 401;
    next(error);
  }
};
