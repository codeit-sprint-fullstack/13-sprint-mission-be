import userService from "#/service/userService.js";
import { cookieExtractor } from "#/middlewares/passport/jwtStrategy.js";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: IS_PRODUCTION ? "none" : "lax",
  secure: IS_PRODUCTION,
  path: "/auth/refresh-token",
};

const authController = {
  async signup(req, res, next) {
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

  async login(req, res, next) {
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

  async refresh(req, res, next) {
    try {
      const { accessToken, refreshToken } = await userService.refresh(
        req.user.id,
        cookieExtractor(req),
      );
      res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
      res.json({ accessToken });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const { id, email, nickname, image, createdAt, updatedAt } = req.user;
      res.json({ id, email, nickname, image, createdAt, updatedAt });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      await userService.logout(req.user.id);
      res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
