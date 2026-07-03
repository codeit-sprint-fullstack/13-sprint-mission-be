import authService from "../services/authService.js";

async function signIn(req, res) {
  const user = await authService.signIn(req.body);
  req.user = user;
  res.status(200).json(user);
}
async function signUp(req, res) {
  const user = await authService.createUser(req.body);
  req.user = user;
  res.status(201).json(user);
}

export default { signIn, signUp };
