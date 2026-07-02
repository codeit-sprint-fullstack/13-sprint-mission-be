import { asyncHandler } from "./asyncHandler.js";
import productService from "../services/productService.js";

const getProducts = asyncHandler(async (req, res) => {
  const { page, pageSize, orderBy = "recent", keyword } = req.query;

  const result = await productService.getProducts(
    page,
    pageSize,
    orderBy,
    keyword,
  );

  res.status(200).json(result);
});

const postProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json(product);
});

const patchProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await productService.updateProduct(productId, req.body);

  res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await productService.deleteProduct(productId);

  res.status(200).json(product);
});

const getProductDetail = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await productService.getProductDetail(productId);

  res.status(200).json(product);
});

export default {
  getProducts,
  postProduct,
  patchProduct,
  deleteProduct,
  getProductDetail,
};
