import express from "express";
import auth from "../middleware/auth.js";
import productCommentController from "../controllers/productCommentController.js";

const productCommentRouter = express.Router({
  mergeParams: true,
});

productCommentRouter
  .route("/")
  .get(productCommentController.getComments)
  .post(auth.verifyAccessToken(), productCommentController.postComment);

productCommentRouter
  .route("/:productCommentId")
  .patch(
    auth.verifyAccessToken(),
    auth.verifyProductCommentAuth,
    productCommentController.patchComment,
  )
  .delete(
    auth.verifyAccessToken(),
    auth.verifyProductCommentAuth,
    productCommentController.deleteComment,
  );

export default productCommentRouter;
