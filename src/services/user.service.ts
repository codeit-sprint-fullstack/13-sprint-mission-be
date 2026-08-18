import * as userRepository from "../repositories/user.repository.js";
import * as productRepository from "../repositories/product.repository.js";
import { NotFoundError } from "../middlewares/errorHandler.js";

// GET /users/me
export async function getMe(userId: number) {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError("사용자를 찾을 수 없습니다");
  return {
    id: user.id,
    nickname: user.nickname,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// GET /users/me/favorites: 내가 좋아요(favorite) 한 상품 목록
// TODO: article
export async function getMyFavorites(userId: number) {
  const products = await productRepository.findFavoritesByUser(userId);
  return { totalCount: products.length, list: products };
}
