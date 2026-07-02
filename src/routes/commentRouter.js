import express from "express";
import commentController from "../controllers/commentController.js";

const commentRouter = express.Router({
  mergeParams: true,
});

commentRouter
  .route("/")
  .post(commentController.postComment)
  .get(commentController.getComment);
commentRouter
  .route("/:commentId")
  .patch(commentController.patchComment)
  .delete(commentController.deleteComment);

export default commentRouter;
