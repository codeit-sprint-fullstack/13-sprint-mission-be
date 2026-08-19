import { RequestHandler } from "express";
import { getUserId } from "../middlewares/auth.js";
import { parseId } from "../middlewares/validate.js";
import likeService from "../services/likeService.js";

const likeProduct: RequestHandler = async (req, res, next) => {
  try {
    const like = await likeService.likeProduct(
      getUserId(req),
      parseId(req.params.id),
    );
    return res.status(201).json(like);
  } catch (error) {
    return next(error);
  }
};

const unlikeProduct: RequestHandler = async (req, res, next) => {
  try {
    await likeService.unlikeProduct(getUserId(req), parseId(req.params.id));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const likeArticle: RequestHandler = async (req, res, next) => {
  try {
    const like = await likeService.likeArticle(
      getUserId(req),
      parseId(req.params.id),
    );
    return res.status(201).json(like);
  } catch (error) {
    return next(error);
  }
};

const unlikeArticle: RequestHandler = async (req, res, next) => {
  try {
    await likeService.unlikeArticle(getUserId(req), parseId(req.params.id));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export default {
  likeProduct,
  unlikeProduct,
  likeArticle,
  unlikeArticle,
};
