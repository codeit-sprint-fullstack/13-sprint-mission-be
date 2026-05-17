const express = require("express");

const {
  updateProductComment,
  deleteProductComment,
  updateArticleComment,
  deleteArticleComment,
} = require("../controllers/commentsController");

const {
  validateCommentId,
  validateUpdateComment,
} = require("../validators/commentValidators");

const router = express.Router();

router.patch(
  "/products/:id",
  validateCommentId,
  validateUpdateComment,
  updateProductComment
);
router.delete("/products/:id", validateCommentId, deleteProductComment);

router.patch(
  "/articles/:id",
  validateCommentId,
  validateUpdateComment,
  updateArticleComment
);
router.delete("/articles/:id", validateCommentId, deleteArticleComment);

module.exports = router;
