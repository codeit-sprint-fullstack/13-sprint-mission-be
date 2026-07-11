import prisma from "../utils/prisma.js";
import { verifyToken } from "../utils/jwt.js";

function extractToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.split(" ")[1];
}

export async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "인증에 실패했습니다." });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (token) {
      const payload = verifyToken(token);
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (user) req.user = user;
    }
  } catch {
    // 토큰이 없거나 잘못돼도 비로그인 상태로 계속 진행
  }
  next();
}
