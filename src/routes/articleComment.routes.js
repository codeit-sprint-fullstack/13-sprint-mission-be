import express from "express";

import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/articleComment.controller.js";

import validate from "../middlewares/validate.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/comment.schema.js";

import {
  articleIdParamSchema,
  commentIdParamSchema,
} from "../validators/common.schema.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validate({ params: articleIdParamSchema, body: createCommentSchema }),
  createComment,
);
router.get("/", validate({ params: articleIdParamSchema }), getComments);
router.patch(
  "/:commentId",
  validate({ params: commentIdParamSchema, body: updateCommentSchema }),
  updateComment,
);
router.delete(
  "/:commentId",
  validate({ params: commentIdParamSchema }),
  deleteComment,
);

export default router;
