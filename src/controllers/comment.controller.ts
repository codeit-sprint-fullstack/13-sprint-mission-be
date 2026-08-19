import * as commentService from "../services/comment.service";
import type { RequestHandler } from "express";
import { routeParam } from "../utils/request.util";

const update: RequestHandler = async (req, res) => {
  res.json(
    await commentService.update(
      routeParam(req.params.commentId),
      req.body.content,
      req.user!,
    ),
  );
};

const remove: RequestHandler = async (req, res) => {
  res.json(
    await commentService.remove(routeParam(req.params.commentId), req.user!),
  );
};

export { remove, update };
