import express from "express";
import { getMe } from "../controllers/usersController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);

export default router;
