import likeService from "../services/likeService.js";

async function likeProduct(req, res, next) {
  const { userId } = req.auth;
  const { id: productId } = req.params;
  try {
    const like = await likeService.likeProduct(userId, productId);
    return res.status(201).json(like);
  } catch (error) {
    return next(error);
  }
}

async function unlikeProduct(req, res, next) {
  const { userId } = req.auth;
  const { id: productId } = req.params;
  try {
    await likeService.unlikeProduct(userId, productId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

async function likeArticle(req, res, next) {
  const { userId } = req.auth;
  const { id: articleId } = req.params;
  try {
    const like = await likeService.likeArticle(userId, articleId);
    return res.status(201).json(like);
  } catch (error) {
    return next(error);
  }
}

async function unlikeArticle(req, res, next) {
  const { userId } = req.auth;
  const { id: articleId } = req.params;
  try {
    await likeService.unlikeArticle(userId, articleId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export default {
  likeProduct,
  unlikeProduct,
  likeArticle,
  unlikeArticle,
};
