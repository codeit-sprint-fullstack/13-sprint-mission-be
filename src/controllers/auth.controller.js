import * as authService from "../services/auth.service.js";

async function signUp(req, res) {
  res.status(201).json(await authService.signUp(req.body));
}

async function signIn(req, res) {
  res.json(await authService.signIn(req.body));
}

async function refresh(req, res) {
  res.json(await authService.refresh(req.body.refreshToken));
}

export { refresh, signIn, signUp };
