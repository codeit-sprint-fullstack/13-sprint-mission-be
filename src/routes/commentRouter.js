import express from "express";
import commentController from "../controllers/commentController.js";

const commentRouter = express.Router({
  mergeParams: true,
});
commentRouter.post("/", commentController.postComment);
commentRouter.get("/", commentController.getComment);
commentRouter.patch("/:commentId", commentController.patchComment);
commentRouter.delete("/:commentId", commentController.deleteComment);

export default commentRouter;
