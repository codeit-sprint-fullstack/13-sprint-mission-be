import passport from "passport";
import authStrategy from "../modules/auth/auth.strategy.js";

passport.use("refresh-token", authStrategy.refreshTokenStrategy);

export default passport;
