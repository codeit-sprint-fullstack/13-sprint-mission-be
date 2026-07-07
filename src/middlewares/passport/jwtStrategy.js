import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userService from "#/service/userService.js";

const accessTokenOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const cookieExtractor = (req) => {
  return req?.cookies?.refreshToken ?? null;
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
