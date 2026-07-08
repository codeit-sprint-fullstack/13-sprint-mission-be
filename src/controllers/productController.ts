import { Request, Response, NextFunction } from "express";
import { productService } from "../services/productService";
import { AppError } from "../middlewares/errorHandler";

export const productController = {
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.user?.userId;
      if (!ownerId) throw new AppError("인증 정보가 없습니다.");

      const { name, description, price, tags } = req.body;
      const files = req.files as Express.Multer.File[];
      const images = files
        ? files.map((file) => `/uploads/${file.filename}`)
        : [];

      let parsedTags: string[] = [];
      if (tags) parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

      const result = await productService.createProduct({
        ownerId,
        name,
        description,
        price: Number(price),
        tags: parsedTags,
        images,
      });

      res
        .status(201)
        .json({
          success: true,
          message: "상품이 등록되었습니다.",
          data: result,
        });
    } catch (error) {
      next(error);
    }
  },

  getProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productService.getProducts();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  getProductById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await productService.getProductById(id);

      if (!result)
        return res
          .status(404)
          .json({ success: false, message: "상품을 찾을 수 없습니다." });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await productService.updateProduct(id, req.body);
      res
        .status(200)
        .json({
          success: true,
          message: "상품이 수정되었습니다.",
          data: result,
        });
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await productService.deleteProduct(id);
      res
        .status(200)
        .json({ success: true, message: "상품이 삭제되었습니다." });
    } catch (error) {
      next(error);
    }
  },
};
