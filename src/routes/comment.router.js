// ============================================
// 댓글 라우트
// - 상품/게시글 댓글 수정, 삭제
// ============================================
import express from "express";
import commentController from "../controllers/comment.controller.js";

const commentRouter = express.Router();

/** ======== 댓글 라우트 ======== */

// PATCH /comments/:commentId
commentRouter.patch("/:commentId", commentController.updateComment);

// DELETE /comments/:commentId
commentRouter.delete("/:commentId", commentController.deleteComment);

export default commentRouter;
