import * as commentService from "../services/comment.service.js";

async function update(req, res) {
  res.json(
    await commentService.update(
      req.params.commentId,
      req.body.content,
      req.user,
    ),
  );
}

async function remove(req, res) {
  res.json(await commentService.remove(req.params.commentId, req.user));
}

export { remove, update };
