import express from "express";
import { createProduct } from "./app.js";

const router = express.Router();

router.post("/", createProduct);

export default router;
