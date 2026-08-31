import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

// multer의 파일 필터 오류, body-parser의 JSON 파싱 오류 등은 Error에 없는
// 필드(status/type)를 들고 오므로, Error와 교차(Intersection)한 타입으로 좁혀서 받는다.
type HttpError = Error & { status?: number; type?: string };

function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({ message: err.issues[0].message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
      return;
    }
    if (err.code === "P2002") {
      res.status(400).json({ message: "이미 존재하는 데이터입니다." });
      return;
    }
  }

  const httpError = err as HttpError;

  if (httpError.type === "entity.parse.failed") {
    res.status(400).json({ message: "JSON 형식이 올바르지 않습니다." });
    return;
  }

  res.status(httpError.status || 500).json({
    message: httpError.message || "서버 오류가 발생했습니다.",
  });
}

export default errorHandler;
