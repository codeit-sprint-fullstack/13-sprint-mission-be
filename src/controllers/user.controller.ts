// ============================================================
// User 컨트롤러
// ============================================================
import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service.js";
import assertUser from "../utils/assertUser.js";

async function getMe(req: Request, res: Response, next: NextFunction) {
  assertUser(req);

  const user = await userService.getById(req.user.userId);

  return res.json({ success: true, data: user });
}

export default {
  getMe,
};
