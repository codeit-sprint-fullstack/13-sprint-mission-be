import express from "express";
import {
  getMe,
  updateMe,
  updateMePassword,
  getMeProducts,
  getMeFavorites,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/me", authMiddleware, getMe);
userRouter.patch("/me", authMiddleware, updateMe);
userRouter.patch("/me/password", authMiddleware, updateMePassword);
userRouter.get("/me/products", authMiddleware, getMeProducts);
userRouter.get("/me/favorites", authMiddleware, getMeFavorites);

export default userRouter;
