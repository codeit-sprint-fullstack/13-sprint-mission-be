import type { RequestHandler } from "express";
import userService from "../services/userService.js";

const getUserDetail: RequestHandler = async (req, res) => {
  const userId = req.auth!.id;
  const user = await userService.getUserDetail(Number(userId));
  res.status(200).json(user);
};

export default { getUserDetail };
