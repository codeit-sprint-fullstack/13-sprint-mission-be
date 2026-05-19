const productService = require("../services/productService");
const productRepository = require("../repositories/productRepository");
const asyncHandler = require("../utils/asyncHandler");

exports.createProduct = asyncHandler(async (req, res) => {
  const savedProduct = await productService.createProduct(req.body);

  res.status(201).json({
    message: "상품이 성공적으로 등록되었습니다.",
    id: savedProduct.id,
  });
});

exports.getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);
  res.status(200).json(result);
});

exports.getProductById = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
  }
  const product = await productService.getProductById(productId);
  res.status(200).json(product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
  }
  await productRepository.deleteProduct(productId);
  res.status(204).end();
});

exports.favoriteProduct = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);
  if (isNaN(productId)) {
    return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
  }
  const updatedProduct = await productService.favoriteProduct(productId);
  res.status(200).json(updatedProduct);
});
