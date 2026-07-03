import * as commentService from "../services/comment.service.js";
import * as productService from "../services/product.service.js";

async function best(req, res) {
  res.json(await productService.best(req.query, req.user?.id));
}

async function list(req, res) {
  res.json(await productService.list(req.query, req.user?.id));
}

async function create(req, res) {
  res.status(201).json(await productService.create(req.body, req.user));
}

async function detail(req, res) {
  res.json(await productService.detail(req.params.productId, req.user?.id));
}

async function update(req, res) {
  res.json(
    await productService.update(req.params.productId, req.body, req.user),
  );
}

async function remove(req, res) {
  res.json(await productService.remove(req.params.productId, req.user));
}

async function favorite(req, res) {
  res
    .status(201)
    .json(await productService.favorite(req.params.productId, req.user));
}

async function unfavorite(req, res) {
  res.json(await productService.unfavorite(req.params.productId, req.user));
}

async function listComments(req, res) {
  res.json(
    await commentService.listByTarget(
      "product",
      req.params.productId,
      req.query,
    ),
  );
}

async function createComment(req, res) {
  res
    .status(201)
    .json(
      await commentService.createForTarget(
        "product",
        req.params.productId,
        req.body.content,
        req.user,
      ),
    );
}

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
