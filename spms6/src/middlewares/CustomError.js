export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "리소스를 찾을 수 없습니다") {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "잘못된 요청입니다") {
    super(400, message);
  }
}

export class ForeignKeyConstraintError extends HttpError {
  constructor(message = "존재하지 않는 외래키 입니다") {
    super(400, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "서버상태가 좋지 않습니다") {
    super(500, message);
  }
}
