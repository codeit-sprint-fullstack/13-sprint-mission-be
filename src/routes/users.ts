import express from "express";
import { getMe } from "../controllers/usersController";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.get("/me", requireAuth, getMe);

export default router;
