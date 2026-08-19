import express from "express";
import auth from "../middleware/auth.js";
import commentController from "../controllers/commentController.js";

const commentRouter = express.Router({
  mergeParams: true,
});

commentRouter
  .route("/")
  .get(commentController.getComments)
  .post(auth.verifyAccessToken(), commentController.postComment);

commentRouter
  .route("/:commentId")
  .patch(
    auth.verifyAccessToken(),
    auth.verifyCommentAuth,
    commentController.patchComment,
  )
  .delete(
    auth.verifyAccessToken(),
    auth.verifyCommentAuth,
    commentController.deleteComment,
  );

export default commentRouter;
