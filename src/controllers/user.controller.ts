import * as userService from "../services/user.service";
import type { RequestHandler } from "express";

const me: RequestHandler = (req, res) => {
  res.json(userService.me(req.user!));
};

export { me };
