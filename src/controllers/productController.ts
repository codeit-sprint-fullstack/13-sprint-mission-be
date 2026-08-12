import { RequestHandler } from "express";
import { listQuerySchema } from "../schemas/querySchema.js";
import productService from "../services/productService.js";
import HttpError from "../errors/HttpError.js";
import { getUserId } from "../middlewares/auth.js";
import { parseId } from "../middlewares/validate.js";

const getAll: RequestHandler = async (req, res, next) => {
  try {
    const query = listQuerySchema.parse(req.query);
    const result = await productService.getAll(req.auth?.userId, query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById: RequestHandler = async (req, res, next) => {
  try {
    const product = await productService.getById(
      parseId(req.params.id),
      req.auth?.userId,
    );
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

const create: RequestHandler = async (req, res, next) => {
  try {
    const createProduct = await productService.create({
      ...req.body,
      ownerId: getUserId(req),
    });
    return res.status(201).json(createProduct);
  } catch (error) {
    return next(error);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const updateProduct = await productService.update({
      ...req.body,
      id: parseId(req.params.id),
    });
    return res.json(updateProduct);
  } catch (error) {
    return next(error);
  }
};

const deleteById: RequestHandler = async (req, res, next) => {
  try {
    await productService.deleteById(parseId(req.params.id));
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
