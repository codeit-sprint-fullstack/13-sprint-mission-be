// ============================================================
// Auth 컨트롤러
// ============================================================
import {
  signUpSchema,
  validateEmailAndPasswordSchema,
} from "../schemas/auth.schema.js";
import authService from "../services/auth.service.js";

/** 회원 가입 컨트롤러 */
async function signup(req, res, next) {
  const data = signUpSchema.parse(req.body); // 유효성 검사 완료된 데이터
  const user = await authService.signup(data); // 유저 데이터
  return res.status(201).json(user);
}

/** 로그인 컨트롤러 */
async function signin(req, res, next) {
  const data = validateEmailAndPasswordSchema.parse(req.body); // 유효성 검사 완료된 데이터
  const { email, password } = data;
  const user = await authService.getUser(email, password); // 유저 데이터

  const accessToken = authService.createToken(user);
  const refreshToken = authService.createToken(user, "refresh");

  await authService.updateUser(user.id, { refreshToken });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.json({ ...user, accessToken });
}

/** 토큰 갱신 컨트롤러 */
async function refreshToken(req, res, next) {
  const { newAccessToken, newRefreshToken } = await authService.refreshToken(
    req.user.userId,
    req.cookies.refreshToken,
  );

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/refresh-token",
  });

  return res.json({ accessToken: newAccessToken });
}

export default { signup, signin, refreshToken };
