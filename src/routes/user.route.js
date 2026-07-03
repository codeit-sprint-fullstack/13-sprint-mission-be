import express from "express";
import * as userController from "../controllers/user.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.route("/me").get(requireAuth, asyncHandler(userController.me));

export default router;
