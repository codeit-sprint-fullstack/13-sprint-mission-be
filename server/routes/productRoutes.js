/**
 * [상품 관련 API 라우터]
 */
const express = require("express");
const router = express.Router();
const ENDPOINTS = require("../constants/endpoints");
const productController = require("../controllers/productController");

// [상품 등록 API - POST 요청 처리]
router.post(ENDPOINTS.ITEMS, productController.createProduct);

// [상품 목록 조회 API - GET 요청 처리]
router.get(ENDPOINTS.ITEMS, productController.getProducts);

// [상품 상세 조회 API]
router.get(ENDPOINTS.ITEM_BY_ID, productController.getProductById);

// [상품 삭제 API]
router.delete(ENDPOINTS.ITEM_BY_ID, productController.deleteProduct);

// [상품 좋아요 증가 API]
router.post(ENDPOINTS.ITEM_FAVORITE, productController.favoriteProduct);

module.exports = router;
