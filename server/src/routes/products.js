const express = require("express");

const {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

const {
  createProductComment,
  listProductComments,
} = require("../controllers/commentsController");

const {
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
  validateProductListQuery,
} = require("../validators/productValidators");

const {
  validateCreateComment,
  validateCommentListQuery,
} = require("../validators/commentValidators");

const router = express.Router();

router.get("/", validateProductListQuery, listProducts);
router.post("/", validateCreateProduct, createProduct);

router.get("/:id", validateProductId, getProduct);
router.patch("/:id", validateProductId, validateUpdateProduct, updateProduct);
router.delete("/:id", validateProductId, deleteProduct);

router.get(
  "/:productId/comments",
  validateCommentListQuery,
  listProductComments
);
router.post(
  "/:productId/comments",
  validateCreateComment,
  createProductComment
);

module.exports = router;
