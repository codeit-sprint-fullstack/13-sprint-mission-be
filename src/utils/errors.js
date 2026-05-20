export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "찾을 수 없는 리소스") {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "잘못된 요청") {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "인증 필요") {
    super(401, message);
  }
}
