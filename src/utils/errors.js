export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "리소스를 찾을 수 없습니다.") {
    super(message, 404);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "유효하지 않은 데이터입니다.") {
    super(message, 400);
  }
}
