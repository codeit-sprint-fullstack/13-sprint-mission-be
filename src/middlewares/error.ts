import type { ErrorRequestHandler, RequestHandler } from "express";

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const notFoundHandler: RequestHandler = (req, res, next) => {
  next(new HttpError(404, "요청한 리소스를 찾을 수 없습니다."));
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err instanceof HttpError ? err.status : 500;
  const message = status === 500 ? "서버 오류가 발생했습니다." : err.message;
  if (status === 500) console.error(err);
  res.status(status).json({ message });
};

export { HttpError, errorHandler, notFoundHandler };
