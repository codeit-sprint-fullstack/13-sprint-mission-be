import express from "express";
import passport from "#/config/passport.js";
import authController from "#/controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", authController.signup);

authRouter.post("/login", authController.login);

authRouter.post(
  "/refresh-token",
  passport.authenticate("refresh-token", { session: false }),
  authController.refresh,
);

authRouter.post(
  "/logout",
  passport.authenticate("access-token", { session: false }),
  authController.logout,
);

export default authRouter;
