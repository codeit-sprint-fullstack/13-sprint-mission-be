import express from "express";
import auth from "../middlewares/auth";
import userController from "../controllers/user.controller";
import { validateQuery } from "../middlewares/validate";
import { getMyLikesQuerySchema } from "../schemas/user.schema";

const userRouter = express.Router();

userRouter.get("/", auth.isLoggedIn, userController.getMe);

userRouter.get(
  "/likes",
  auth.isLoggedIn,
  validateQuery(getMyLikesQuerySchema),
  userController.getMyLikes,
);

export default userRouter;
