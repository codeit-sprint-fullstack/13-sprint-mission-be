import express, { type Request, type Response } from "express";
import upload from "../middlewares/upload";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.post("/", requireAuth, upload.array("images", 3), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    res.status(400).json({ message: "이미지 파일이 필요합니다." });
    return;
  }

  const urls = files.map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
  );

  res.status(201).json({ urls });
});

export default router;
