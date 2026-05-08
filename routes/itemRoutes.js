/** ======== 상품 라우트 ======== */

import express from "express";

import {
  getProducts,
  getProduct,
  postProduct,
  patchProduct,
  deleteProduct,
} from "../controllers/itemController.js";

const router = express.Router();

// GET /items
router.get("/", getProducts);
// GET /items:id
router.get("/:id", getProduct);
// POST /items
router.post("/", postProduct);
// PATCH /items/:id
router.patch("/:id", patchProduct);
// DELETE /items/:id
router.delete("/:id", deleteProduct);

export default router;
