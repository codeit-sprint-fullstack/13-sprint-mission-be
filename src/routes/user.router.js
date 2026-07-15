import express from "express";
import { getMe, getMyFavorites } from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/me", verifyAccessToken, getMe);
router.get("/me/favorites", verifyAccessToken, getMyFavorites);

export default router;
