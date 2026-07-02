import productRepository from "../repositories/productRepository.js";

async function getProducts(page, pageSize, orderBy, keyword) {
  const [products, totalCount] = await Promise.all([
    productRepository.findAll(page, pageSize, orderBy, keyword),
    productRepository.countByKeyword(keyword),
  ]);

  return {
    totalCount,
    list: products,
  };
}

async function createProduct(data) {
  return productRepository.create(data);
}

async function updateProduct(productId, data) {
  return productRepository.update(productId, data);
}

async function deleteProduct(productId) {
  return productRepository.deleteById(productId);
}

async function getProductDetail(productId) {
  return productRepository.findById(productId);
}

export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
};
