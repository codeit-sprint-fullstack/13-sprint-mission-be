import { RequestHandler } from "express";
import HttpError from "../errors/HttpError.js";
import { getUserId } from "../middlewares/auth.js";
import { parseId } from "../middlewares/validate.js";
import { listQuerySchema } from "../schemas/querySchema.js";
import articleService from "../services/articleService.js";

const getAll: RequestHandler = async (req, res, next) => {
  try {
    const query = listQuerySchema.parse(req.query);
    const result = await articleService.getAll(req.auth?.userId, query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById: RequestHandler = async (req, res, next) => {
  try {
    const article = await articleService.getById(
      parseId(req.params.id),
      req.auth?.userId,
    );
    return res.json(article);
  } catch (error) {
    return next(error);
  }
};

const create: RequestHandler = async (req, res, next) => {
  try {
    const createArticle = await articleService.create({
      ...req.body,
      ownerId: getUserId(req),
    });
    return res.status(201).json(createArticle);
  } catch (error) {
    return next(error);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const updateArticle = await articleService.update({
      ...req.body,
      id: parseId(req.params.id),
    });
    return res.json(updateArticle);
  } catch (error) {
    return next(error);
  }
};

const deleteById: RequestHandler = async (req, res, next) => {
  try {
    await articleService.deleteById(parseId(req.params.id));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new HttpError("이미지 파일이 필요합니다.", 400);
    }
    return res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    return next(error);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  deleteById,
  uploadImage,
};
