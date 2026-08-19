import * as commentService from "../services/comment.service";
import * as productService from "../services/product.service";
import type { RequestHandler } from "express";
import { routeParam } from "../utils/request.util";

const best: RequestHandler = async (req, res) => {
  res.json(await productService.best(req.query, req.user?.id));
};

const list: RequestHandler = async (req, res) => {
  res.json(await productService.list(req.query, req.user?.id));
};

const create: RequestHandler = async (req, res) => {
  res.status(201).json(await productService.create(req.body, req.user!));
};

const detail: RequestHandler = async (req, res) => {
  res.json(
    await productService.detail(routeParam(req.params.productId), req.user?.id),
  );
};

const update: RequestHandler = async (req, res) => {
  res.json(
    await productService.update(
      routeParam(req.params.productId),
      req.body,
      req.user!,
    ),
  );
};

const remove: RequestHandler = async (req, res) => {
  res.json(
    await productService.remove(routeParam(req.params.productId), req.user!),
  );
};

const favorite: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(
      await productService.favorite(
        routeParam(req.params.productId),
        req.user!,
      ),
    );
};

const unfavorite: RequestHandler = async (req, res) => {
  res.json(
    await productService.unfavorite(
      routeParam(req.params.productId),
      req.user!,
    ),
  );
};

const listComments: RequestHandler = async (req, res) => {
  res.json(
    await commentService.listByTarget(
      "product",
      routeParam(req.params.productId),
      req.query,
    ),
  );
};

const createComment: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(
      await commentService.createForTarget(
        "product",
        routeParam(req.params.productId),
        req.body.content,
        req.user!,
      ),
    );
};

export {
  best,
  create,
  createComment,
  detail,
  favorite,
  list,
  listComments,
  remove,
  unfavorite,
  update,
};
