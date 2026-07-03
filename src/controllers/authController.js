import authService from "../services/authService.js";

async function signIn(req, res) {
  const user = await authService.signIn(req.body);
  const accessToken = authService.createToken(user, "access");
  const refreshToken = authService.createToken(user, "refresh");
  req.user = user;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ ...user, accessToken });
}
async function signUp(req, res) {
  const user = await authService.createUser(req.body);
  req.user = user;
  const accessToken = authService.createToken(user, "access");
  const refreshToken = authService.createToken(user, "refresh");
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(201).json({ ...user, accessToken });
}

export default { signIn, signUp };
