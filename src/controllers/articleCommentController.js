import articleCommentService from "#/service/articleCommentService.js";
import {
  createCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
} from "#/schemas/articleComment.Schema.js";

const articleCommentController = {
  async getComments(req, res, next) {
    try {
      const { articleId } = req.params;
      const data = getCommentsSchema.parse(req.query);
      const result = await articleCommentService.getComments({ articleId, ...data });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async createComment(req, res, next) {
    try {
      const { articleId } = req.params;
      const { content } = createCommentSchema.parse(req.body);
      const comment = await articleCommentService.createComment({
        articleId,
        content,
        userId: req.user.id,
      });
      res.status(201).json({ success: true, data: comment });
    } catch (err) {
      next(err);
    }
  },

  async updateComment(req, res, next) {
    try {
      const data = updateCommentSchema.parse(req.body);
      const comment = await articleCommentService.updateComment(req.user.id, req.params.id, data);
      res.json(comment);
    } catch (err) {
      next(err);
    }
  },

  async deleteComment(req, res, next) {
    try {
      await articleCommentService.deleteComment(req.user.id, req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default articleCommentController;
