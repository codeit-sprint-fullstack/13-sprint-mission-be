import { Prisma } from "../../src/generated/prisma/index.js";

const errorHandler = (err, req, res, next) => {
  console.log(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      message: "데이터베이스 요청 오류",
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "서버 에러",
  });
};

export default errorHandler;
