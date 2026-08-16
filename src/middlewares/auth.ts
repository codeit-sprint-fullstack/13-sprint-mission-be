import type { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import { verifyToken } from "../utils/jwt";

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.split(" ")[1];
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({ message: "로그인이 필요합니다." });
      return;
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      res.status(401).json({ message: "유효하지 않은 사용자입니다." });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "인증에 실패했습니다." });
  }
}

export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
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
