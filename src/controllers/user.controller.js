import * as userRepository from "../repositories/user.repository.js";
import * as productRepository from "../repositories/product.repository.js";

// GET /users/me
export const getMe = async (req, res) => {
  const user = await userRepository.findById(req.auth.userId);
  res.json({
    id: user.id,
    nickname: user.nickname,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
};

// GET /users/me/favorites: 내가 좋아요(favorite) 한 상품 목록
export const getMyFavorites = async (req, res) => {
  const products = await productRepository.findFavoritesByUser(req.auth.userId);
  res.json({ totalCount: products.length, list: products });
};
