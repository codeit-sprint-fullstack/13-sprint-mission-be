import type { Request, Response, NextFunction, CookieOptions } from "express";
import userService from "./userService";
import { cookieExtractor } from "../../middlewares/passport/jwtStrategy";
import type { PublicUser } from "../../types/common";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: IS_PRODUCTION ? "none" : "lax",
  secure: IS_PRODUCTION,
  path: "/auth/refresh-token",
};

const authController = {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.signup(req.body);
      res.status(201).json({
        success: true,
        data: { id: user.id, email: user.email, nickname: user.nickname },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await userService.getUser(email, password);
      const { accessToken, refreshToken } = await userService.login(user.id);
      res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
      res.json({ accessToken });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { accessToken, refreshToken } = await userService.refresh(
        req.user!.id,
        cookieExtractor(req),
      );
      res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
      res.json({ accessToken });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, email, nickname, image, createdAt, updatedAt } = req.user!;
      const publicUser: PublicUser = { id, email, nickname, image, createdAt, updatedAt };
      res.json(publicUser);
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.logout(req.user!.id);
      res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
