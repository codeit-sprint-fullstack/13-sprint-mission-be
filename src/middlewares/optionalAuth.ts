import type { Request, Response, NextFunction } from "express";
import passport from "../config/passport";

export default function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate(
    "access-token",
    { session: false },
    (err: unknown, user: Express.User | false) => {
      if (user) req.user = user;
      next();
    },
  )(req, res, next);
}
