import type { Request } from "express";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  type StrategyOptionsWithoutRequest,
  type VerifiedCallback,
} from "passport-jwt";
import userService from "../../domains/user/userService";

interface JwtPayload {
  userId: string;
}

const accessTokenOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const cookieExtractor = (req: Request): string | null => {
  if (req?.cookies?.refreshToken) return req.cookies.refreshToken;

  const rawCookie = req?.headers?.cookie;
  const match = rawCookie?.match(/Bearer\s+(\S+)/);
  return match ? match[1] : null;
};

const refreshTokenOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

async function jwtVerify(payload: JwtPayload, done: VerifiedCallback) {
  try {
    const user = await userService.getUserById(payload.userId);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);
const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);

export default { accessTokenStrategy, refreshTokenStrategy };
