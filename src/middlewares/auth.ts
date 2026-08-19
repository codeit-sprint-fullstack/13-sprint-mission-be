import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, RequestHandler } from "express";
import * as usersRepository from "../repositories/user.repository";
import { jwtSecret } from "../utils/env.util";
import { HttpError } from "./error";
import type { AuthUser } from "../types/domain";

function signAccessToken(user: AuthUser): string {
  return jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: "30m" });
}

function signRefreshToken(user: AuthUser): string {
  return jwt.sign({ sub: user.id, type: "refresh" }, jwtSecret, {
    expiresIn: "7d",
  });
}

function parseToken(req: Request): JwtPayload | null {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return null;
  try {
    const payload = jwt.verify(token, jwtSecret);
    return typeof payload === "string" ? null : payload;
  } catch {
    return null;
  }
}

async function attachUser(
  req: Request,
  required: boolean,
): Promise<AuthUser | null> {
  const payload = parseToken(req);
  const userId = typeof payload?.sub === "string" ? payload.sub : null;
  if (!userId) {
    if (required) throw new HttpError(401, "로그인이 필요합니다.");
    return null;
  }
  const user = await usersRepository.findById(userId);
  if (!user) {
    if (required) throw new HttpError(401, "유효하지 않은 사용자입니다.");
    return null;
  }
  req.user = user;
  return user;
}

const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    await attachUser(req, true);
    next();
  } catch (error) {
    next(error);
  }
};

const optionalAuth: RequestHandler = async (req, res, next) => {
  try {
    await attachUser(req, false);
    next();
  } catch (error) {
    next(error);
  }
};

export {
  jwtSecret,
  optionalAuth,
  requireAuth,
  signAccessToken,
  signRefreshToken,
};
