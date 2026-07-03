const authService = require("../services/auth.service");

async function signUp(req, res) {
  res.status(201).json(await authService.signUp(req.body));
}

async function signIn(req, res) {
  res.json(await authService.signIn(req.body));
}

async function refresh(req, res) {
  res.json(await authService.refresh(req.body.refreshToken));
}

module.exports = { refresh, signIn, signUp };
