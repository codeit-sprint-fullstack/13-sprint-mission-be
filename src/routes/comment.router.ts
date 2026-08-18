import { Router, RequestHandler } from "express";
import { updateComment, deleteComment } from "../controllers/comment.controller.js";
import { updateCommentSchema } from "../schemas/comment.schema.js";
import { validate } from "../middlewares/validate.js";
import { verifyAccessToken } from "../middlewares/auth.js";

const router = Router();

// 요구사항(댓글 기능 인가): "댓글을 등록한 사용자만 댓글을 수정하거나 삭제할 수 있습니다."
router.patch(
  "/:commentId",
  verifyAccessToken,
  validate(updateCommentSchema),
  updateComment as RequestHandler,
);
router.delete("/:commentId", verifyAccessToken, deleteComment as RequestHandler);

export default router;