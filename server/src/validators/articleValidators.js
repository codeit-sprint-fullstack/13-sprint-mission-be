const { body, param, query } = require("express-validator");
const checkValidation = require("./commonValidators");

const validateArticleId = [
  param("id").isInt({ min: 1 }).withMessage("게시글 ID는 숫자여야 합니다.").toInt(),
  checkValidation,
];

const validateCreateArticle = [
  body("title").isString().trim().notEmpty().withMessage("제목은 필수입니다."),
  body("content").isString().trim().notEmpty().withMessage("내용은 필수입니다."),
  checkValidation,
];

const validateUpdateArticle = [
  body("title").optional().isString().trim().notEmpty(),
  body("content").optional().isString().trim().notEmpty(),
  checkValidation,
];

const validateArticleListQuery = [
  query("offset").optional().isInt({ min: 0 }).withMessage("offset은 0 이상이어야 합니다.").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit은 1~100 사이여야 합니다.").toInt(),
  query("orderBy").optional().isIn(["recent"]).withMessage("orderBy는 recent만 가능합니다."),
  query("keyword").optional().isString().trim(),
  checkValidation,
];

module.exports = {
  validateArticleId,
  validateCreateArticle,
  validateUpdateArticle,
  validateArticleListQuery,
};
