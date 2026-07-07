import { nanoid } from "nanoid";
import { createError } from "#/utils/httpError.js";
import { searchByKeyword } from "#/utils/searchHandler.js";
import productRepository from "#/repository/productRepository.js";

const orderMap = {
  oldest: { createdAt: "asc" },
  recent: { createdAt: "desc" },
};

const productService = {
  async getProducts({ page, pageSize, orderBy, keyword }) {
    const offset = (page - 1) * pageSize;
    const order = orderMap[orderBy] ?? orderMap.recent;

    if (keyword) {
      return searchByKeyword({
        table: "products",
        fields: ["name", "description"],
        keyword,
        order: orderBy === "oldest" ? "asc" : "desc",
        limit: pageSize,
        offset,
      });
    }

    const [totalCount, list] = await Promise.all([
      productRepository.count(),
      productRepository.findMany({ orderBy: order, skip: offset, take: pageSize }),
    ]);

    return { list, totalCount };
  },

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) throw createError("상품을 찾을 수 없습니다.", 404);
    return product;
  },

  async createProduct(userId, data) {
    return productRepository.create({ id: nanoid(), userId, ...data });
  },

  async updateProduct(id, data) {
    return productRepository.update(id, data);
  },

  async deleteProduct(id) {
    return productRepository.delete(id);
  },
};

export default productService;
