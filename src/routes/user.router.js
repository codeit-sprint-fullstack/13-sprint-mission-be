// TODO: 수정해야함
import express from "express";
import userService from "../services/userService.js";
import auth from "../middlewares/auth.js";
import passport from "../config/passport.js";

const userRouter = express.Router();

userRouter.post("/users", async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      const error = new Error("email, name, password 가 모두 필요합니다.");
      error.code = 400;
      throw error;
    }
    const user = await userService.createUser({ email, name, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/signIn", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const error = new Error("email, password 가 모두 필요합니다.");
      error.code = 400;
      throw error;
    }
    const user = await userService.getUser(email, password);

    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json({ ...user, accessToken });
  } catch (error) {
    next(error);
  }
});

userRouter.post(
  "/session-signIn",
  auth.validateEmailAndPassword,
  passport.authenticate("local"),
  (req, res) => {
    res.json(req.user);
  },
);

userRouter.post(
  "/token/refresh",
  passport.authenticate("refresh-token", { session: false }),
  async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { id } = req.user;

      const { newAccessToken, newRefreshToken } =
        await userService.refreshToken(id, refreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/token/refresh",
      });
      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      return next(error);
    }
  },
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res, next) => {
    const accessToken = userService.createToken(req.user);
    const refreshToken = userService.createToken(req.user, "refresh");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ accessToken });
  },
);

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

userRouter.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao"),
  (req, res, next) => {
    const accessToken = userService.createToken(req.user);
    const refreshToken = userService.createToken(req.user, "refresh");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ accessToken });
  },
);

userRouter.get(
  "/auth/kakao",
  passport.authenticate("kakao", {
    scope: ["profile_nickname", "account_email"],
  }),
);

userRouter.get(
  "/auth/naver/callback",
  passport.authenticate("naver"),
  (req, res, next) => {
    const accessToken = userService.createToken(req.user);
    const refreshToken = userService.createToken(req.user, "refresh");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ accessToken });
  },
);

userRouter.get(
  "/auth/naver",
  passport.authenticate("naver", {
    scope: ["nickname", "email"],
  }),
);

export default userRouter;
