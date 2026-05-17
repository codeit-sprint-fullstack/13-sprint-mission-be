const { body, param, query } = require("express-validator");
const checkValidation = require("./commonValidators");

const validateCommentId = [
  param("id").isInt({ min: 1 }).withMessage("댓글 ID는 숫자여야 합니다.").toInt(),
  checkValidation,
];

const validateCreateComment = [
  body("content").isString().trim().notEmpty().withMessage("댓글 내용은 필수입니다."),
  checkValidation,
];

const validateUpdateComment = [
  body("content").isString().trim().notEmpty().withMessage("댓글 내용은 필수입니다."),
  checkValidation,
];

const validateCommentListQuery = [
  // 변경: cursor는 아직 구현하지 않아서 limit만 검사합니다.
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit은 1~50 사이여야 합니다.").toInt(),
  checkValidation,
];

module.exports = {
  validateCommentId,
  validateCreateComment,
  validateUpdateComment,
  validateCommentListQuery,
};
