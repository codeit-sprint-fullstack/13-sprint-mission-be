import prisma from "../config/prisma.js";
import { asyncHandler } from "./asyncHandler.js";
import productRepository from "../repositories/productRepository.js";

const getProduct = asyncHandler(async (req, res) => {
  const { page, pageSize, orderBy = "recent", keyword } = req.query;
  const [products, totalCount] = await Promise.all([
    productRepository.findAll(page, pageSize, orderBy, keyword),
    productRepository.countByKeyword(keyword),
  ]);
  res.status(200).json({ totalCount, list: products });
});

const postProduct = asyncHandler(async (req, res) => {
  const createdProduct = await productRepository.create(req.body);
  res.status(201).json(createdProduct);
});

const patchProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const patchedProduct = await productRepository.update(productId, req.body);
  res.status(200).json(patchedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const deletedProduct = await productRepository.deleteById(productId);
  res.status(200).json(deletedProduct);
});

const getProductDetail = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await productRepository.findById(productId);
  res.status(200).json(product);
});

export default {
  getProduct,
  postProduct,
  patchProduct,
  deleteProduct,
  getProductDetail,
};
