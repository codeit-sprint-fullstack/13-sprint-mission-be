import { Strategy as JwtStrategy } from "passport-jwt";
import authService from "./auth.service.js";

const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["refreshToken"];
  }
  return token;
};

const refreshTokenOptions = {
  jwtFromRequest: cookieExtractor, // 쿠키에서 꺼냄
  secretOrKey: process.env.JWT_SECRET,
};

async function jwtVerify(payload, done) {
  try {
    if (payload.tokenType !== "refresh") {
      return done(null, false);
    }
    const user = await authService.getUserById(payload.userId);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);

export default {
  refreshTokenStrategy,
};
