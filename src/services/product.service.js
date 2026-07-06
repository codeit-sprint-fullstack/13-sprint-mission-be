import productRepository from "../repositories/product.repository.js";
// TODO: 수정해야함

async function getById(id) {
  return await productRepository.getById(id);
}

async function create(product) {
  return await productRepository.save(product);
}

export default {
  getById,
  create,
};
