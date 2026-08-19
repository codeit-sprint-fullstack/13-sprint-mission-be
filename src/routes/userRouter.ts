import express from "express";
import auth from "../middleware/auth.js";
import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter
  .route("/me")
  .get(auth.verifyAccessToken(), userController.getUserDetail);

export default userRouter;
