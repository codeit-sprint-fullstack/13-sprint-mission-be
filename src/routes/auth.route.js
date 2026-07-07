import express from "express";
import {
  signUp,
  signIn,
  refreshToken,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signUp", signUp);
authRouter.post("/signIn", signIn);
authRouter.post("/refresh-token", refreshToken);

export default authRouter;
