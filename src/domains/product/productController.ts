import type { Request, Response, NextFunction } from "express";
import productService from "./productService";
import {
  createProductSchema,
  getProductsSchema,
  updateProductSchema,
} from "./product.Schema";

const productController = {
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = getProductsSchema.parse(req.query);
      const result = await productService.getProducts(data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getProductById(req.params.id as string, req.user?.id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await productService.createProduct(req.user!.id, data);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await productService.updateProduct(req.user!.id, req.params.id as string, data);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.deleteProduct(req.user!.id, req.params.id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async uploadImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = (req.files as Express.Multer.File[] | undefined) ?? [];
      const images = files.map((file) => `/uploads/${file.filename}`);
      res.json({ images });
    } catch (err) {
      next(err);
    }
  },

  async likeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await productService.likeProduct(req.user!.id, req.params.id as string);
      res.json({ success: true, favoriteCount: result.favoriteCount });
    } catch (err) {
      next(err);
    }
  },

  async unlikeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await productService.unlikeProduct(req.user!.id, req.params.id as string);
      res.json({ success: true, favoriteCount: result.favoriteCount });
    } catch (err) {
      next(err);
    }
  },
};

export default productController;
