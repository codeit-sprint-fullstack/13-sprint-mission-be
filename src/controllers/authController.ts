import type { RequestHandler } from "express";
import authService from "../services/authService.js";

const signIn: RequestHandler = async (req, res) => {
  const user = await authService.signIn(req.body);
  const accessToken = authService.createToken(user, "access");
  const refreshToken = authService.createToken(user, "refresh");
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ ...user, accessToken });
};
const signUp: RequestHandler = async (req, res) => {
  const user = await authService.createUser(req.body);
  const accessToken = authService.createToken(user, "access");
  const refreshToken = authService.createToken(user, "refresh");
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(201).json({ ...user, accessToken });
};

export default { signIn, signUp };
