import { signInSchema, signUpSchema } from "./auth.schema.js";
import authService from "./auth.service.js";

function setRefreshTokenCookie(res, refreshToken) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });
}

async function signUp(req, res) {
  const validated = signUpSchema.parse(req.body);
  const result = await authService.signUp({
    email: validated.email,
    nickname: validated.nickname,
    password: validated.password,
  });
  const { accessToken, refreshToken, user } = result;

  setRefreshTokenCookie(res, refreshToken);

  return res.status(201).json({ ...user, accessToken });
}

async function signIn(req, res) {
  const validated = signInSchema.parse(req.body);
  const result = await authService.signIn({
    email: validated.email,
    password: validated.password,
  });

  const { accessToken, refreshToken, user } = result;

  setRefreshTokenCookie(res, refreshToken);
  res.json({ ...user, accessToken });
}

async function refreshToken(req, res) {
  const userId = req.user.id;
  const currentRefreshToken = req.cookies.refreshToken;
  const result = await authService.refreshAuthToken(
    userId,
    currentRefreshToken,
  );
  const { accessToken, refreshToken } = result;
  setRefreshTokenCookie(res, refreshToken);
  res.json({ accessToken });
}
export default {
  signUp,
  signIn,
  refreshToken,
};
