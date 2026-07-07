import articleService from "#/service/articleService.js";
import {
  createArticleSchema,
  getArticleSchema,
  updateArticleSchema,
} from "#/schemas/article.Schema.js";

const articleController = {
  async getArticles(req, res, next) {
    try {
      const data = getArticleSchema.parse(req.query);
      const result = await articleService.getArticles(data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getArticleById(req, res, next) {
    try {
      const article = await articleService.getArticleById(req.params.id, req.user?.id);
      res.json(article);
    } catch (err) {
      next(err);
    }
  },

  async createArticle(req, res, next) {
    try {
      const data = createArticleSchema.parse(req.body);
      const article = await articleService.createArticle(req.user.id, data);
      res.status(201).json({ success: true, data: article });
    } catch (err) {
      next(err);
    }
  },

  async updateArticle(req, res, next) {
    try {
      const data = updateArticleSchema.parse(req.body);
      const article = await articleService.updateArticle(req.params.id, data);
      res.json(article);
    } catch (err) {
      next(err);
    }
  },

  async deleteArticle(req, res, next) {
    try {
      await articleService.deleteArticle(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async likeArticle(req, res, next) {
    try {
      const result = await articleService.likeArticle(req.user.id, req.params.id);
      res.json({ success: true, favoriteCount: result.favoriteCount });
    } catch (err) {
      next(err);
    }
  },

  async unlikeArticle(req, res, next) {
    try {
      const result = await articleService.unlikeArticle(req.user.id, req.params.id);
      res.json({ success: true, favoriteCount: result.favoriteCount });
    } catch (err) {
      next(err);
    }
  },
};

export default articleController;
