import { RequestHandler } from "express";
import { getUserId } from "../middlewares/auth.js";
import { parseId } from "../middlewares/validate.js";
import commentService from "../services/commentService.js";

const parseLimit = (limit: unknown) => (limit ? Number(limit) : undefined);

const getAllByProduct: RequestHandler = async (req, res, next) => {
  try {
    const result = await commentService.getAllByProduct(
      parseId(req.params.id),
      parseLimit(req.query.limit),
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllByArticle: RequestHandler = async (req, res, next) => {
  try {
    const result = await commentService.getAllByArticle(
      parseId(req.params.id),
      parseLimit(req.query.limit),
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById: RequestHandler = async (req, res, next) => {
  try {
    const comment = await commentService.getById(parseId(req.params.id));
    return res.json(comment);
  } catch (error) {
    return next(error);
  }
};

const create: RequestHandler = async (req, res, next) => {
  try {
    const createComment = await commentService.create({
      ...req.body,
      ownerId: getUserId(req),
    });
    return res.status(201).json(createComment);
  } catch (error) {
    next(error);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const updateComment = await commentService.update(
      parseId(req.params.id),
      req.body,
    );
    return res.json(updateComment);
  } catch (error) {
    next(error);
  }
};

const deleteById: RequestHandler = async (req, res, next) => {
  try {
    await commentService.deleteById(parseId(req.params.id));
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default {
  getAllByProduct,
  getAllByArticle,
  getById,
  create,
  update,
  deleteById,
};
