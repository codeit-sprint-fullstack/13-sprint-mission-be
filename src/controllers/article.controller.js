const articleService = require("../services/article.service");
const commentService = require("../services/comment.service");

async function best(req, res) {
  res.json(await articleService.best(req.query, req.user?.id));
}

async function list(req, res) {
  res.json(await articleService.list(req, query, req.user?.id));
}

async function create(req, res) {
  res.status(201).json(await articleService.create(req.body, req.user));
}

async function detail(req, res) {
  res.json(await articleService.detail(req.params.articleId, req.user?.id));
}

async function update(req, res) {
  res.json(
    await articleService.update(req.params.articleId, req.body, req.user),
  );
}

async function remove(req, res) {
  res.json(await articleService.remove(req.params.articleId, req.user));
}

async function favorite(req, res) {
  res
    .status(201)
    .json(await articleService.favorite(req.params.articleId, req.user));
}

async function unfavorite(req, res) {
  res.json(await articleService.unfavorite(req.params.articleId, req.user));
}

async function listComments(req, res) {
  res.json(
    await commentService.listByTarget(
      "article",
      req.params.articleId,
      req.query,
    ),
  );
}

async function createComment(req, res) {
  res
    .status(201)
    .json(
      await commentService.createForTarget(
        "article",
        req.params.articleId,
        req.body.content,
        req.user,
      ),
    );
}

module.exports = {
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
