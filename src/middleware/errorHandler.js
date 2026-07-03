export default function errorHandler(error, req, res, next) {
  const status = error.status ?? 500;

  return res.status(status).json({
    path: req.path,
    method: req.method,
    message: error.message ?? "Internal Server Error",
    data: error.data ?? undefined,
    date: new Date(),
  });
}
