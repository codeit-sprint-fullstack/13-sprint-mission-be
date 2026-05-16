import express from "express";

import validate from "../middlewares/validate.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/comment.schema.js";

import {
  productIdParamSchema,
  commentIdParamSchema,
} from "../validators/common.schema.js";

import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/productComment.controller.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validate({ params: productIdParamSchema, body: createCommentSchema }),
  createComment,
);
router.get("/", validate({ params: productIdParamSchema }), getComments);
router.patch(
  "/:productId",
  validate({ params: commentIdParamSchema, body: updateCommentSchema }),
  updateComment,
);
router.delete(
  "/:productId",
  validate({ params: commentIdParamSchema }),
  deleteComment,
);

export default router;
