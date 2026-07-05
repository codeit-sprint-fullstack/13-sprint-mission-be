// ============================================================
// Product 컨트롤러
// ============================================================
import parseId from "../utils/parse.js";
import productService from "../services/product.service.js";

/** 상품 조회 컨트롤러
 * - GET /products
 */
async function getAllProducts(req, res, next) {
  const { page = 1, pageSize = 10, search = "", order = "recent" } = req.query;
  const products = await productService.getAll({
    page,
    pageSize,
    search,
    order,
    userId: req.user ? parseId(req.user.userId) : undefined,
  });

  res.json({ success: true, products });
}

/** 단일 상품 조회 컨트롤러
 * - GET /products/:id
 */
async function getProduct(req, res, next) {
  const product = await productService.getById(
    parseId(req.params.id),
    req.user ? parseId(req.user.userId) : undefined,
  );

  res.json({ success: true, data: product });
}

/** 상품 등록 컨트롤러
 * - POST /products
 */
async function createProduct(req, res, next) {
  const newProduct = await productService.create({
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    userId: parseId(req.user.userId),
  });

  res.status(201).json({ success: true, data: newProduct });
}

/** 상품 수정 컨트롤러
 * - PATCH /products/:id
 */
async function updateProduct(req, res, next) {
  const updatedProduct = await productService.update({
    id: parseId(req.params.id),
    data: req.body, // validate 미들웨어에서 검증 완료된 데이터
    userId: parseId(req.user.userId),
  });

  res.json({ success: true, data: updatedProduct });
}

/** 상품 삭제 컨트롤러
 * - DELETE /products/:id
 */
async function deleteProduct(req, res, next) {
  await productService.deleteById(
    parseId(req.params.id),
    parseId(req.user.userId),
  );

  res.json({ success: true, message: "상품이 삭제되었습니다" });
}

/** 상품 좋아요 컨트롤러
 * - POST /products/:productId/likes
 */
async function toggleProductLike(req, res, next) {
  const likedProduct = await productService.toggleLike({
    ownerId: parseId(req.user.userId),
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
