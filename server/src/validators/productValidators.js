const { body, param, query } = require("express-validator");
const checkValidation = require("./commonValidators");

const validateProductId = [
  param("id").isInt({ min: 1 }).withMessage("상품 ID는 숫자여야 합니다.").toInt(),
  checkValidation,
];

const validateCreateProduct = [
  body("name").isString().trim().notEmpty().withMessage("상품명은 필수입니다."),
  body("description").isString().trim().notEmpty().withMessage("상품 설명은 필수입니다."),
  body("price").isInt({ min: 0 }).withMessage("가격은 0 이상의 숫자여야 합니다.").toInt(),
  body("tags").optional().isArray().withMessage("태그는 배열이어야 합니다."),
  checkValidation,
];

const validateUpdateProduct = [
  body("name").optional().isString().trim().notEmpty(),
  body("description").optional().isString().trim().notEmpty(),
  body("price").optional().isInt({ min: 0 }).toInt(),
  body("tags").optional().isArray(),
  checkValidation,
];

const validateProductListQuery = [
  query("offset").optional().isInt({ min: 0 }).withMessage("offset은 0 이상이어야 합니다.").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit은 1~100 사이여야 합니다.").toInt(),
  query("orderBy").optional().isIn(["recent"]).withMessage("orderBy는 recent만 가능합니다."),
  query("keyword").optional().isString().trim(),
  checkValidation,
];

module.exports = {
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
  validateProductListQuery,
};
