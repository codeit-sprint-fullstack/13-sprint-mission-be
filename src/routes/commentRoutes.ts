import { Router } from "express";
import { commentController } from "../controllers/commentController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/products/:productId/comments",
  authenticate,
  commentController.createComment,
);
router.get("/products/:productId/comments", commentController.getComments);

router.patch("/comments/:id", authenticate, commentController.updateComment);
router.delete("/comments/:id", authenticate, commentController.deleteComment);

export default router;
