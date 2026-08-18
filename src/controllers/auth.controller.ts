// ============================================================
// Auth 컨트롤러
// ============================================================
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service.js";
import assertUser from "../utils/assertUser.js";

/** 회원 가입 컨트롤러 */
async function signup(
  req: Request<{}, {}, Pick<User, "email" | "nickname" | "password">>,
  res: Response,
  next: NextFunction,
) {
  const user = await authService.signup(req.body); // 유저 데이터
  return res.status(201).json({ success: true, data: user });
}

/** 로그인 컨트롤러 */
async function signin(
  req: Request<{}, {}, Pick<User, "email" | "password">>,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;
  const user = await authService.getUser(email, password); // 유저 데이터

  const accessToken = authService.createToken(user.id);
  const refreshToken = authService.createToken(user.id, "refresh");

  await authService.updateUser(user.id, { refreshToken });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/auth/refresh-token",
  });

  res.json({ success: true, data: { ...user, accessToken } });
}

/** 토큰 갱신 컨트롤러 */
async function refreshToken(req: Request, res: Response, next: NextFunction) {
  assertUser(req);

  const { newAccessToken, newRefreshToken } = await authService.refreshToken(
    req.user.userId,
    req.cookies.refreshToken,
  );

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/auth/refresh-token",
  });

  return res.json({ success: true, data: { accessToken: newAccessToken } });
}

export default { signup, signin, refreshToken };
