import * as authService from "../services/auth.service";
import type { RequestHandler } from "express";

const signUp: RequestHandler = async (req, res) => {
  res.status(201).json(await authService.signUp(req.body));
};

const signIn: RequestHandler = async (req, res) => {
  res.json(await authService.signIn(req.body));
};

const refresh: RequestHandler = async (req, res) => {
  res.json(await authService.refresh(req.body.refreshToken));
};

export { refresh, signIn, signUp };
