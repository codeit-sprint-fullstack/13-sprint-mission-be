import passport from "#/config/passport.js";

export default function optionalAuth(req, res, next) {
  passport.authenticate("access-token", { session: false }, (err, user) => {
    if (user) req.user = user;
    next();
  })(req, res, next);
}
