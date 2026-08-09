import { Response } from "express";
import { AuthenticatedRequest } from "../types/express.js";
import * as userRepository from "../repositories/user.repository.js";
import * as productRepository from "../repositories/product.repository.js";
import { NotFoundError } from "../middlewares/errorHandler.js";

// GET /users/me
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  const user = await userRepository.findById(req.auth.userId);
  if (!user) throw new NotFoundError("사용자를 찾을 수 없습니다");
  res.json({
    id: user.id,
    nickname: user.nickname,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
};

// GET /users/me/favorites: 내가 좋아요(favorite) 한 상품 목록
// TODO: article
export const getMyFavorites = async (req: AuthenticatedRequest, res: Response) => {
  const products = await productRepository.findFavoritesByUser(req.auth.userId);
  res.json({ totalCount: products.length, list: products });
};
