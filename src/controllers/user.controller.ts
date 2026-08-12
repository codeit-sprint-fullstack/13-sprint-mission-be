// ============================================================
// User 컨트롤러
// ============================================================
import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service.js";

async function getMe(req: Request, res: Response, next: NextFunction) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const user = await userService.getById(req.user.userId);

  return res.json({ success: true, data: user });
}

export default {
  getMe,
};
