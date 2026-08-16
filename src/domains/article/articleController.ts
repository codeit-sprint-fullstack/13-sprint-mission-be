import type { Request, Response, NextFunction } from "express";
import articleService from "./articleService";
import {
  createArticleSchema,
  getArticleSchema,
  updateArticleSchema,
} from "./article.Schema";

const articleController = {
  async getArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = getArticleSchema.parse(req.query);
      const result = await articleService.getArticles(data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getArticleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const article = await articleService.getArticleById(req.params.id as string, req.user?.id);
      res.json(article);
    } catch (err) {
      next(err);
    }
  },

  async createArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createArticleSchema.parse(req.body);
      const article = await articleService.createArticle(req.user!.id, data);
      res.status(201).json({ success: true, data: article });
    } catch (err) {
      next(err);
    }
  },

  async updateArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = updateArticleSchema.parse(req.body);
      const article = await articleService.updateArticle(req.user!.id, req.params.id as string, data);
      res.json(article);
    } catch (err) {
      next(err);
    }
  },

  async deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await articleService.deleteArticle(req.user!.id, req.params.id as string);
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

  async likeArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await articleService.likeArticle(req.user!.id, req.params.id as string);
      res.json({ success: true, favoriteCount: result.favoriteCount });
    } catch (err) {
      next(err);
    }
  },

  async unlikeArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await articleService.unlikeArticle(req.user!.id, req.params.id as string);
      res.json({ success: true, favoriteCount: result.favoriteCount });
    } catch (err) {
      next(err);
    }
  },
};

export default articleController;
