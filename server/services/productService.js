const productRepository = require("../repositories/productRepository");
const { validateProduct } = require("../schemas/productSchema");

exports.createProduct = async (productData) => {
  // 1. 스키마를 통한 유효성 검사
  const validationError = validateProduct(productData);
  if (validationError) {
    const error = new Error(validationError);
    error.status = 400;
    throw error;
  }

  const { name, title, price, description, tags } = productData;

  const data = {
    title: title || name,
    price: Number(price),
    description: description,
    tags: Array.isArray(tags) ? tags : [],
  };

  return await productRepository.createProduct(data);
};

exports.getProducts = async (queryOptions) => {
  const {
    page = 1,
    pageSize = 10,
    orderBy = "recent",
    keyword = "",
  } = queryOptions;
  const skip = (parseInt(page) - 1) * parseInt(pageSize);
  const take = parseInt(pageSize);

  const where = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const sorting =
    orderBy === "favorite" ? { favoriteCount: "desc" } : { createdAt: "desc" };

  const totalCount = await productRepository.countProducts(where);
  const list = await productRepository.findProducts(where, sorting, skip, take);

  return { list, totalCount };
};

exports.getProductById = async (id) => {
  const product = await productRepository.findProductById(id);
  if (!product) {
    const error = new Error("상품을 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  return product;
};

exports.favoriteProduct = async (id) => {
  return await productRepository.incrementFavoriteCount(id);
};
