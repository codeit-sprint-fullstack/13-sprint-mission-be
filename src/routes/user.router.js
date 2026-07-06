import express from "express";
import { validate } from "../middlewares/validate.js";
import { signUp, signIn } from "../controllers/auth.controller.js";
import { signInSchema, signUpSchema } from "../schemas/auth.schema.js";

const router = express.Router();

router.post("/signUp", validate(signUpSchema), signUp);
router.post("/signIn", validate(signInSchema), signIn);

export default router;
