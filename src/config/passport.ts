import passport from "passport";
import localStrategy from "../middlewares/passport/localStrategy";
import jwtStrategy from "../middlewares/passport/jwtStrategy";

passport.use(localStrategy);
passport.use("access-token", jwtStrategy.accessTokenStrategy);
passport.use("refresh-token", jwtStrategy.refreshTokenStrategy);

export default passport;
