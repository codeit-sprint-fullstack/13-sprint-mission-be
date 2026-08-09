import express, { RequestHandler } from "express";
import { getMe, getMyFavorites } from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/me", verifyAccessToken, getMe as RequestHandler);
router.get("/me/favorites", verifyAccessToken, getMyFavorites as RequestHandler);

export default router;
