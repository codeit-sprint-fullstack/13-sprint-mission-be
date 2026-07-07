import userService from "../services/userService.js";

async function signUp(req, res, next) {
  try {
    const { email, nickName, encryptedpassword } = req.body;
    if (!email || !nickName || !encryptedpassword) {
      const error = new Error("email, nickName, password 가 모두 필요합니다.");
      error.code = 400;
      throw error;
    }
    const user = await userService.createUser({
      email,
      nickName,
      encryptedpassword,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, encryptedpassword } = req.body;
  try {
    if (!email || !encryptedpassword) {
      const error = new Error("email, password 가 모두 필요합니다.");
      error.code = 400;
      throw error;
    }
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
}

async function getMe(req, res, next) {
  try {
    const user = await userService.getMe(req.auth.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userId } = req.auth;
    const { newAccessToken, newRefreshToken } = await userService.refreshToken(
      userId,
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
}

export default {
  signUp,
  login,
  refreshToken,
  getMe,
};
