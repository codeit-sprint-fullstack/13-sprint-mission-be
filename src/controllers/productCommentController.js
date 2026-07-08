import productCommentService from "#/service/productCommentService.js";
import {
  createCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
} from "#/schemas/productComment.Schema.js";

const productCommentController = {
  async getComments(req, res, next) {
    try {
      const { productId } = req.params;
      const data = getCommentsSchema.parse(req.query);
      const result = await productCommentService.getComments({ productId, ...data });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async createComment(req, res, next) {
    try {
      const { productId } = req.params;
      const { content } = createCommentSchema.parse(req.body);
      const comment = await productCommentService.createComment({
        productId,
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
      const comment = await productCommentService.updateComment(
        req.user.id,
        req.params.id,
        data,
      );
      res.json(comment);
    } catch (err) {
      next(err);
    }
  },

  async deleteComment(req, res, next) {
    try {
      await productCommentService.deleteComment(req.user.id, req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default productCommentController;
