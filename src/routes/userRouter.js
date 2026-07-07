import express from "express";
import passport from "#/config/passport.js";
import authController from "#/controllers/authController.js";

const userRouter = express.Router();

userRouter.get(
  "/me",
  passport.authenticate("access-token", { session: false }),
  authController.getMe,
);

export default userRouter;
