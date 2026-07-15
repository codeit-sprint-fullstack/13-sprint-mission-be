import { Request, Response, NextFunction } from "express";
import { commentService } from "../services/commentService";
import { AppError } from "../middlewares/errorHandler";

export const commentController = {
  createComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.user?.userId;
      if (!ownerId) {
        const error: AppError = new Error("인증 정보가 없습니다.");
        error.statusCode = 401;
        throw error;
      }

      const productId = Number(req.params.productId);
      const { content } = req.body;

      if (!content)
        return res
          .status(400)
          .json({ success: false, message: "댓글 내용을 입력해 주세요." });

      const result = await commentService.createComment(
        ownerId,
        productId,
        content,
      );
      res
        .status(201)
        .json({
          success: true,
          message: "댓글이 등록되었습니다.",
          data: result,
        });
    } catch (error) {
      next(error);
    }
  },

  getComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const result = await commentService.getCommentsByProductId(productId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  updateComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { content } = req.body;
      const result = await commentService.updateComment(id, content);
      res
        .status(200)
        .json({
          success: true,
          message: "댓글이 수정되었습니다.",
          data: result,
        });
    } catch (error) {
      next(error);
    }
  },

  deleteComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await commentService.deleteComment(id);
      res
        .status(200)
        .json({ success: true, message: "댓글이 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  },
};
