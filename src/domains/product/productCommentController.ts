import type { Request, Response, NextFunction } from "express";
import productCommentService from "./productCommentService";
import {
  createCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
} from "./productComment.Schema";

const productCommentController = {
  async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = req.params.productId as string;
      const data = getCommentsSchema.parse(req.query);
      const result = await productCommentService.getComments({ productId, ...data });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = req.params.productId as string;
      const { content } = createCommentSchema.parse(req.body);
      const comment = await productCommentService.createComment({
        productId,
        content,
        userId: req.user!.id,
      });
      res.status(201).json({ success: true, data: comment });
    } catch (err) {
      next(err);
    }
  },

  async updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = updateCommentSchema.parse(req.body);
      const comment = await productCommentService.updateComment(
        req.user!.id,
        req.params.id as string,
        data,
      );
      res.json(comment);
    } catch (err) {
      next(err);
    }
  },

  async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productCommentService.deleteComment(req.user!.id, req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default productCommentController;
