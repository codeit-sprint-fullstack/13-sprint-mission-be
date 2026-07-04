import express from "express";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signIn", authController.signIn);
authRouter.post("/signUp", authController.signUp);

export default authRouter;
