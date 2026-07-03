class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function notFoundHandler(req, res, next) {
  next(new HttpError(404, "요청한 리소스를 찾을 수 없습니다."));
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = status === 500 ? "서버 오류가 발생했습니다." : err.message;
  if (status === 500) console.error(err);
  res.status(status).json({ message });
}

module.exports = { HttpError, errorHandler, notFoundHandler };
