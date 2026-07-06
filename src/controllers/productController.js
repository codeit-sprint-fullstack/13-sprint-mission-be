import productService from "../services/productService.js";

const getProducts = async (req, res) => {
  const { page, pageSize, orderBy = "recent", keyword } = req.query;
  const userId = req.auth?.id ?? null;

  const result = await productService.getProducts(
    page,
    pageSize,
    orderBy,
    keyword,
    userId,
  );

  res.status(200).json(result);
};

const postProduct = async (req, res) => {
  const product = await productService.createProduct({
    ...req.body,
    userId: req.auth.id,
  });

  res.status(201).json(product);
};

const patchProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await productService.updateProduct(productId, {
    ...req.body,
    userId: req.auth.id,
  });

  res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await productService.deleteProduct(productId);

  res.status(200).json(product);
};

const getProductDetail = async (req, res) => {
  const { productId } = req.params;
  const userId = req.auth?.id ?? null;

  const product = await productService.getProductDetail(productId, userId);

  res.status(200).json(product);
};

const likeProduct = async (req, res) => {
  const { productId } = req.params;
  const { id: userId } = req.auth;
  const result = await productService.likeProduct(productId, userId);
  res.status(200).json(result);
};

const unlikeProduct = async (req, res) => {
  const { productId } = req.params;
  const { id: userId } = req.auth;
  const result = await productService.unlikeProduct(productId, userId);
  res.status(200).json(result);
};

export default {
  getProducts,
  postProduct,
  patchProduct,
  deleteProduct,
  getProductDetail,
  likeProduct,
  unlikeProduct,
};
