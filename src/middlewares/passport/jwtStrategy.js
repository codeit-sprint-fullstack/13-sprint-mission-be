import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userService from "#/service/userService.js";

const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const cookieExtractor = (req) => {
  if (req?.cookies?.refreshToken) return req.cookies.refreshToken;

  const rawCookie = req?.headers?.cookie;
  const match = rawCookie?.match(/Bearer\s+(\S+)/);
  return match ? match[1] : null;
};

const refreshTokenOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

async function jwtVerify(payload, done) {
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
