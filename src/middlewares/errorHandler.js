import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({ message: err.issues[0].message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }
    if (err.code === "P2002") {
      return res.status(400).json({ message: "이미 존재하는 데이터입니다." });
    }
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON 형식이 올바르지 않습니다." });
  }

  res.status(err.status || 500).json({
    message: err.message || "서버 오류가 발생했습니다.",
  });
}

export default errorHandler;
