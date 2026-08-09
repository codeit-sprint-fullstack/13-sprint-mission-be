import express from "express";
import * as userController from "../controllers/user.controller";
import asyncHandler from "../middlewares/asyncHandler";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.route("/me").get(requireAuth, asyncHandler(userController.me));

export default router;
