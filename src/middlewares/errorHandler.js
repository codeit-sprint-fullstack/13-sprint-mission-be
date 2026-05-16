const errorHandler = (err, req, res, next) => {
  console.log(err);

  res.status(err.status || 500).json({
    message: err.message || "서버 에러",
  });
};

export default errorHandler;
