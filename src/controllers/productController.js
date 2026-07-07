import productService from "#/service/productService.js";
import {
  createProductSchema,
  getProductsSchema,
  updateProductSchema,
} from "#/schemas/product.Schema.js";

const productController = {
  async getProducts(req, res, next) {
    try {
      const data = getProductsSchema.parse(req.query);
      const result = await productService.getProducts(data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id, req.user?.id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },

  async createProduct(req, res, next) {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await productService.createProduct(req.user.id, data);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  },

  async updateProduct(req, res, next) {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await productService.updateProduct(req.params.id, data);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async uploadImages(req, res, next) {
    try {
      const images = (req.files ?? []).map((file) => `/uploads/${file.filename}`);
      res.json({ images });
    } catch (err) {
      next(err);
    }
  },

  async likeProduct(req, res, next) {
    try {
      const result = await productService.likeProduct(req.user.id, req.params.id);
      res.json({ success: true, favoriteCount: result.favoriteCount });
    } catch (err) {
      next(err);
    }
  },

  async unlikeProduct(req, res, next) {
    try {
      const result = await productService.unlikeProduct(req.user.id, req.params.id);
      res.json({ success: true, favoriteCount: result.favoriteCount });
    } catch (err) {
      next(err);
    }
  },
};

export default productController;
