import express from "express";
import upload from "../middlewares/upload.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", requireAuth, upload.array("images", 3), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "이미지 파일이 필요합니다." });
  }

  const urls = req.files.map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
  );

  res.status(201).json({ urls });
});

export default router;
