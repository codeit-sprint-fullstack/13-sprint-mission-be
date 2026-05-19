export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "리소스가 없는데?") {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "요청이 잘못됐어요") {
    super(400, message);
  }
}
