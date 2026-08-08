import * as articleService from "../services/article.service";
import * as commentService from "../services/comment.service";
import type { RequestHandler } from "express";
import { routeParam } from "../utils/request.util";

const best: RequestHandler = async (req, res) => {
  res.json(await articleService.best(req.query, req.user?.id));
};

const list: RequestHandler = async (req, res) => {
  res.json(await articleService.list(req.query, req.user?.id));
};

const create: RequestHandler = async (req, res) => {
  res.status(201).json(await articleService.create(req.body, req.user!));
};

const detail: RequestHandler = async (req, res) => {
  res.json(
    await articleService.detail(routeParam(req.params.articleId), req.user?.id),
  );
};

const update: RequestHandler = async (req, res) => {
  res.json(
    await articleService.update(
      routeParam(req.params.articleId),
      req.body,
      req.user!,
    ),
  );
};

const remove: RequestHandler = async (req, res) => {
  res.json(
    await articleService.remove(routeParam(req.params.articleId), req.user!),
  );
};

const favorite: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(
      await articleService.favorite(
        routeParam(req.params.articleId),
        req.user!,
      ),
    );
};

const unfavorite: RequestHandler = async (req, res) => {
  res.json(
    await articleService.unfavorite(
      routeParam(req.params.articleId),
      req.user!,
    ),
  );
};

const listComments: RequestHandler = async (req, res) => {
  res.json(
    await commentService.listByTarget(
      "article",
      routeParam(req.params.articleId),
      req.query,
    ),
  );
};

const createComment: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(
      await commentService.createForTarget(
        "article",
        routeParam(req.params.articleId),
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
