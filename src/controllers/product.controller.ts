import { Request as JwtRequest } from "express-jwt";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { ProductBodyDto } from "../dtos/product.dto";
import productService from "../services/product.service";

const createProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;
  const images = (req.files as Express.MulterS3.File[]).map(
    (file) => file.location,
  );
  const { name, description, price, tags }: ProductBodyDto = req.body;

  const createdProduct = await productService.createProduct({
    authorId,
    images,
    name,
    description,
    price,
    tags,
  });

  res.status(201).json(createdProduct);
};

const deleteProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;
  const { productId } = req.params;

  await productService.deleteProduct({
    productId: Number(productId),
    authorId,
  });

  res.status(200).json({ message: "상품이 삭제되었습니다." });
};

const updateProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;
  const images = (req.files as Express.MulterS3.File[]).map(
    (file) => file.location,
  );
  const { productId } = req.params;
  const { price, tags, description, name, existingImages }: ProductBodyDto =
    req.body;

  const updatedProduct = await productService.updateProduct({
    productId: Number(productId),
    authorId,
    images,
    name,
    description,
    price,
    tags,
    existingImages,
  });

  res.status(200).json(updatedProduct);
};

const getProductList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { page, pageSize, sort, keyword } = req.validateQuery!;

  const { list, totalProducts } = await productService.getProductList({
    page,
    pageSize,
    sort,
    keyword,
  });

  res.status(200).json({ list, totalProducts });
};

const getProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;
  const authorId = req.auth?.userId;

  const product = await productService.getProduct({
    productId: Number(productId),
    authorId,
  });

  res.status(200).json(product);
};

const likeProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;

  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;

  const result = await productService.likeProduct({
    productId: Number(productId),
    authorId,
  });

  res.status(200).json(result);
};

const unlikeProduct = async (
  req: JwtRequest<{ userId: number }>,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.params;

  if (!req.auth?.userId) {
    throw new CustomError("인증 정보가 올바르지 않습니다", 401);
  }
  const authorId = req.auth.userId;

  const result = await productService.unlikeProduct({
    productId: Number(productId),
    authorId,
  });

  res.status(200).json(result);
};

export default {
  createProduct,
  deleteProduct,
  updateProduct,
  getProductList,
  likeProduct,
  unlikeProduct,
  getProduct,
};
