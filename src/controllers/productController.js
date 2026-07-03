import productService from "../services/productService.js";

const getProducts = async (req, res) => {
  const { page, pageSize, orderBy = "recent", keyword } = req.query;

  const result = await productService.getProducts(
    page,
    pageSize,
    orderBy,
    keyword,
  );

  res.status(200).json(result);
};

const postProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json(product);
};

const patchProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await productService.updateProduct(productId, req.body);

  res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await productService.deleteProduct(productId);

  res.status(200).json(product);
};

const getProductDetail = async (req, res) => {
  const { productId } = req.params;

  const product = await productService.getProductDetail(productId);

  res.status(200).json(product);
};

export default {
  getProducts,
  postProduct,
  patchProduct,
  deleteProduct,
  getProductDetail,
};
