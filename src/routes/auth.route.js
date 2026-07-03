import express from "express";
import * as authController from "../controllers/auth.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

router.route("/signUp").post(asyncHandler(authController.signUp));
router.route("/signIn").post(asyncHandler(authController.signIn));
router.route("/refresh").post(asyncHandler(authController.refresh));

export default router;
