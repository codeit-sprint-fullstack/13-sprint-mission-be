import { Request, Response, NextFunction } from "express";
import {
  createProductSchema,
  getProductListQuerySchema,
  updateProductSchema,
} from "../schemas/product.schema";
import { idSchema } from "../schemas/common.schema";
import ProductService from "../services/product.service";
import z from "zod";

const getProductList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, pageSize, sort, keyword } = req.validatedQuery as z.infer<
      typeof getProductListQuerySchema
    >;

    const { products, total, pageNum, take } = await ProductService.findProduct(
      page,
      pageSize,
      sort,
      keyword,
    );

    res.json({
      success: true,
      page: pageNum,
      pageSize: take,
      totalCount: total,
      totalPages: Math.ceil(total / take),
      filters: { keyword, sort },
      list: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductBYId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: productId } = idSchema.parse(req.params);
    const userId = req.auth?.userId;

    const product = await ProductService.findProductById(productId, userId!);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const postProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.price) req.body.price = parseInt(req.body.price);
    if (typeof req.body.tags === "string") {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (e) {
        req.body.tags = [];
      }
    }

    const validatedBody = createProductSchema.parse(req.body);
    const writerId = req.auth?.userId;

    const imagePaths = Array.isArray(req.files)
      ? req.files.map((file) => `/products/${file.filename}`)
      : [];

    const product = await ProductService.createProduct({
      name: validatedBody.name,
      description: validatedBody.description,
      price: validatedBody.price,
      tags: validatedBody.tags,
      writerId: writerId!,
      images: imagePaths,
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const patchProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = idSchema.parse(req.params);
    if (req.body.price) req.body.price = parseInt(req.body.price);

    if (typeof req.body.tags === "string") {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (e) {
        req.body.tags = undefined;
      }
    }

    const validatedBody = updateProductSchema.parse(req.body);

    let imagePaths: string[] | undefined = undefined;
    if (Array.isArray(req.files) && req.files.length > 0) {
      imagePaths = req.files.map((file) => `/products/${file.filename}`);
    }

    const product = await ProductService.updateProduct(id, {
      ...validatedBody,
      images: imagePaths,
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = idSchema.parse(req.params);
    await ProductService.deleteProduct(id);

    res.json({ success: true, message: "Product가 삭제되었습니다" });
  } catch (error) {
    next(error);
  }
};

const postProductLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: productId } = idSchema.parse(req.params);
    const userId = req.auth?.userId;

    const result = await ProductService.addLikeProduct(productId, userId!);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteProductLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: productId } = idSchema.parse(req.params);
    const userId = req.auth?.userId;

    const result = await ProductService.unLikeProduct(productId, userId!);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getProductList,
  getProductBYId,
  postProduct,
  patchProduct,
  deleteProduct,
  postProductLike,
  deleteProductLike,
};
