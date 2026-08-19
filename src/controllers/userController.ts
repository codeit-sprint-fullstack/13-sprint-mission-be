import { RequestHandler } from "express";
import HttpError from "../errors/HttpError.js";
import { getUserId } from "../middlewares/auth.js";
import userService from "../services/userService.js";

const signUp: RequestHandler = async (req, res, next) => {
  try {
    const { email, nickName, encryptedpassword } = req.body;
    const user = await userService.createUser({
      email,
      nickName,
      encryptedpassword,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const login: RequestHandler = async (req, res, next) => {
  const { email, encryptedpassword } = req.body;
  try {
    const user = await userService.getUser(email, encryptedpassword);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refreshToken");
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
};

const getMe: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.getMe(getUserId(req));
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { newAccessToken, newRefreshToken } = await userService.refreshToken(
      getUserId(req),
      refreshToken,
    );
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
};

export default {
  signUp,
  login,
  refreshToken,
  getMe,
};
