// ============================================================
// Product 컨트롤러
// ============================================================
import { NextFunction, Request, Response } from "express";
import productService from "../services/product.service.js";
import { ProductInput, ProductQuery } from "../types/product.js";
import parseId from "../utils/parse.js";

/** 상품 조회 컨트롤러
 * - GET /products
 */
async function getAllProducts(
  req: Request<{}, {}, {}, ProductQuery>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const {
    page = "1",
    pageSize = "10",
    search = "",
    order = "recent",
  } = req.query;
  const { data, pagination } = await productService.getAll({
    page,
    pageSize,
    search,
    order,
    userId: req.user.userId,
  });

  res.json({ success: true, data, pagination });
}

/** 단일 상품 조회 컨트롤러
 * - GET /products/:id
 */
async function getProduct(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const product = await productService.getById(
    parseId(req.params.id),
    req.user.userId,
  );

  res.json({ success: true, data: product });
}

/** 상품 등록 컨트롤러
 * - POST /products
 */
async function createProduct(
  req: Request<{}, {}, ProductInput>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const newProduct = await productService.create({
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    userId: req.user.userId,
  });

  res.status(201).json({ success: true, data: newProduct });
}

/** 상품 수정 컨트롤러
 * - PATCH /products/:id
 */
async function updateProduct(
  req: Request<{ id: string }, {}, ProductInput>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const updatedProduct = await productService.update({
    id: parseId(req.params.id),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    userId: req.user.userId,
  });

  res.json({ success: true, data: updatedProduct });
}

/** 상품 삭제 컨트롤러
 * - DELETE /products/:id
 */
async function deleteProduct(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  await productService.deleteById(parseId(req.params.id), req.user.userId);

  res.json({ success: true, message: "상품이 삭제되었습니다" });
}

/** 상품 좋아요 컨트롤러
 * - POST /products/:productId/likes
 */
async function toggleProductLike(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return res.status(401).json({ success: false, message: "인증 필요" });

  const likedProduct = await productService.toggleLike({
    ownerId: req.user.userId,
    productId: parseId(req.params.productId),
  });

  res.json({ success: true, data: likedProduct });
}

export default {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductLike,
};
