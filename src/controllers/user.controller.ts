import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.js";
import * as userService from "../services/user.service.js";

// GET /users/me
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  const user = await userService.getMe(req.auth.userId);
  res.json(user);
};

// GET /users/me/favorites: 내가 좋아요(favorite) 한 상품 목록
export const getMyFavorites = async (req: AuthenticatedRequest, res: Response) => {
  const favorites = await userService.getMyFavorites(req.auth.userId);
  res.json(favorites);
};
