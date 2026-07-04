export default function errorHandler(error, req, res, next) {
  if (error.name === "UnauthorizedError") {
    return res.status(401).json({
      path: req.path,
      method: req.method,
      message: "Invalid Token",
      data: undefined,
      date: new Date(),
    });
  }
  const status = error.status ?? 500;

  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
}
