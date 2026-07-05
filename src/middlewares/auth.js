// ============================================================
// Auth Middlewares
// - 인증/인가 미들웨어
// ============================================================
import { expressjwt } from "express-jwt";
import { validateEmailAndPasswordSchema } from "../schemas/auth.schema.js";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
  getToken: (req) => req.cookies.refreshToken,
});

function validateEmailAndPassword(req, res, next) {
  validateEmailAndPasswordSchema(req.body);
  next();
}
export default {
  verifyAccessToken,
  verifyRefreshToken,
  validateEmailAndPassword,
};
