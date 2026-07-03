const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../utils/env");
const usersRepository = require("../repositories/user.repository");
const { HttpError } = require("./error");

function signAccessToken(user) {
  return jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: "30m" });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: "refresh" }, jwtSecret, {
    expiresIn: "7d",
  });
}

function parseToken(req) {
  const header = req.headers.authrization || "";
  const [, token] = header.split(" ");
  if (!token) return null;
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}

function attachUser(req, required) {
  const payload = parseToken(req);
  if (!payload?.sub) {
    if (required) throw new HttpError(401, "로그인이 필요합니다.");
    return null;
  }
  const user = usersRepository.findById(payload.sub);
  if (!user) {
    if (required) throw new HttpError(401, "유효하지 않은 사용자입니다.");
    return null;
  }
  req.user = user;
  return user;
}

function requireAuth(req, res, next) {
  try {
    attachUser(req, true);
    next();
  } catch (error) {
    next(error);
  }
}

function optionalAuth(req, res, next) {
  try {
    attachUser(req, false);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  jwtSecret,
  optionalAuth,
  requireAuth,
  signAccessToken,
  signRefreshToken,
};
