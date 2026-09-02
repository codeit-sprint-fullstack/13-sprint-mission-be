import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import z from "zod";
import { signInSchema, signUpSchema } from "../schemas/user.schema";
import { getRefreshTokenCookieOptions } from "../lib/cookie";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, nickname, password } = req.body as z.infer<
      typeof signUpSchema
    >;

    const user = await userService.createUser({ email, nickname, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as z.infer<typeof signInSchema>;

    const user = await userService.getUser(email, password);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });

    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
    res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userId } = req.auth!;

    const { accessToken, refreshToken: newRefreshToken } =
      await userService.refreshToken(userId, refreshToken);

    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
    return res.json({ accessToken });
  } catch (error) {
    return next(error);
  }
};

export default {
  signup,
  signin,
  refreshToken,
};
