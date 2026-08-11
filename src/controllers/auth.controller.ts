// ============================================================
// Auth 컨트롤러
// ============================================================
import authService from "../services/auth.service.js";

/** 회원 가입 컨트롤러 */
async function signup(req, res, next) {
  const user = await authService.signup(req.body); // 유저 데이터
  return res.status(201).json({ success: true, data: user });
}

/** 로그인 컨트롤러 */
async function signin(req, res, next) {
  const { email, password } = req.body;
  const user = await authService.getUser(email, password); // 유저 데이터

  const accessToken = authService.createToken(user);
  const refreshToken = authService.createToken(user, "refresh");

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
async function refreshToken(req, res, next) {
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
