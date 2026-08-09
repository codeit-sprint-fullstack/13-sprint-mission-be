import express from "express";
import { validate } from "../middlewares/validate.js";
import {
  signUp,
  signIn,
  refreshAccessToken,
  logout,
} from "../controllers/auth.controller.js";
import { signInSchema, signUpSchema } from "../schemas/auth.schema.js";

const router = express.Router();

router.post("/signUp", validate(signUpSchema), signUp);
router.post("/signIn", validate(signInSchema), signIn);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

export default router;
