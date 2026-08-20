import type { RequestHandler } from "express";
import productService from "../services/productService.js";

const getProducts: RequestHandler = async (req, res) => {
  const { page, pageSize, orderBy = "recent", keyword } = req.query;
  const userId = req.auth?.id;

  const result = await productService.getProducts({
    page: typeof page === "string" ? Number(page) : undefined,
    pageSize: typeof pageSize === "string" ? Number(pageSize) : undefined,
    orderBy: typeof orderBy === "string" ? orderBy : "recent",
    keyword: typeof keyword === "string" ? keyword : undefined,
    userId,
  });

  res.status(200).json(result);
};

const postProduct: RequestHandler = async (req, res) => {
  const userId = req.auth!.id;
  const files = req.files as Express.Multer.File[] | undefined;

  const product = await productService.createProduct({
    ...req.body,
    tags: Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags
        ? [req.body.tags]
        : [],
    images: files?.map((file) => file.path.replaceAll("\\", "/")) ?? [],
    userId,
  });

  res.status(201).json(product);
};

const patchProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const userId = req.auth!.id;

  const product = await productService.updateProduct(
    Number(productId),
    userId,
    req.body,
  );

  res.status(200).json(product);
};

const deleteProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const userId = req.auth!.id;

  const product = await productService.deleteProduct(Number(productId), userId);

  res.status(200).json(product);
};

const getProductDetail: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const userId = req.auth?.id;

  const product = await productService.getProductDetail(
    Number(productId),
    userId,
  );

  res.status(200).json(product);
};

const likeProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const userId = req.auth!.id;
  const result = await productService.likeProduct(Number(productId), userId);
  res.status(200).json(result);
};

const unlikeProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const userId = req.auth!.id;
  const result = await productService.unlikeProduct(Number(productId), userId);
  res.status(200).json(result);
};

export default {
  getProducts,
  postProduct,
  patchProduct,
  deleteProduct,
  getProductDetail,
  likeProduct,
  unlikeProduct,
};
