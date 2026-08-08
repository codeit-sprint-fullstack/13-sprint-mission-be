import jwt from "jsonwebtoken";
import * as usersRepository from "../repositories/user.repository.js";
import { jwtSecret } from "../utils/env.util.js";
import { HttpError } from "./error.js";

function signAccessToken(user) {
  return jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: "30m" });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: "refresh" }, jwtSecret, {
    expiresIn: "7d",
  });
}

function parseToken(req) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return null;
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}

async function attachUser(req, required) {
  const payload = parseToken(req);
  if (!payload?.sub) {
    if (required) throw new HttpError(401, "로그인이 필요합니다.");
    return null;
  }
  const user = await usersRepository.findById(payload.sub);
  if (!user) {
    if (required) throw new HttpError(401, "유효하지 않은 사용자입니다.");
    return null;
  }
  req.user = user;
  return user;
}

async function requireAuth(req, res, next) {
  try {
    await attachUser(req, true);
    next();
  } catch (error) {
    next(error);
  }
}

async function optionalAuth(req, res, next) {
  try {
    await attachUser(req, false);
    next();
  } catch (error) {
    next(error);
  }
}

export {
  jwtSecret,
  optionalAuth,
  requireAuth,
  signAccessToken,
  signRefreshToken,
};
