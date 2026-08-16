import type { Request, Response, NextFunction } from "express";
import articleCommentService from "./articleCommentService";
import {
  createCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
} from "./articleComment.Schema";

const articleCommentController = {
  async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const articleId = req.params.articleId as string;
      const data = getCommentsSchema.parse(req.query);
      const result = await articleCommentService.getComments({ articleId, ...data });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const articleId = req.params.articleId as string;
      const { content } = createCommentSchema.parse(req.body);
      const comment = await articleCommentService.createComment({
        articleId,
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
      const comment = await articleCommentService.updateComment(
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
      await articleCommentService.deleteComment(req.user!.id, req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default articleCommentController;
