import productRepository from "../repositories/product.repository";
import { CustomError } from "../utils/customError";

const createProduct = async ({
  authorId,
  images,
  name,
  description,
  price,
  tags,
}: {
  authorId: number;
  images: string[];
  name: string;
  description: string;
  price: number;
  tags?: string[];
}) => {
  return productRepository.create({
    authorId,
    images,
    name,
    description,
    price,
    tags,
  });
};

const deleteProduct = async ({
  productId,
  authorId,
}: {
  productId: number;
  authorId: number;
}) => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new CustomError("해당 상품을 찾을 수 없습니다.", 404);
  }
  if (product.authorId !== authorId) {
    throw new CustomError("본인이 등록한 상품이 아닙니다.", 403);
  }

  await productRepository.deleteById(productId);
};

const updateProduct = async ({
  productId,
  authorId,
  images,
  name,
  description,
  price,
  tags,
  existingImages,
}: {
  productId: number;
  authorId: number;
  images: string[];
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  existingImages?: string[];
}) => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new CustomError("해당 상품을 찾을 수 없습니다.", 404);
  }
  if (product.authorId !== authorId) {
    throw new CustomError("본인이 등록한 상품이 아닙니다.", 403);
  }

  //기존의 유지할 이미지가 없을 경우 undefined가 들어가 .filter 시 에러가 난다 없을 경우 빈배열로 (existingImages ?? []) 만듦
  //악의적인 사람이 existingImages에 아무 이미지나 넣어도 기존의 이미지로 판단 할 수 있기 때문에 validExistingImages로 기존의 이미지가 맞는지 검증
  const validExistingImages = (existingImages ?? []).filter((img) =>
    product.images.includes(img),
  );
  const finalImages = [...validExistingImages, ...images];

  if (finalImages.length < 1 || finalImages.length > 3) {
    throw new CustomError("이미지는 최소 1개 이상 3개 이하여야합니다.", 400);
  }

  return productRepository.update(productId, {
    name,
    description,
    price,
    tags,
    images: finalImages,
  });
};

const getProductList = async ({
  page,
  pageSize,
  sort,
  keyword,
}: {
  page: number;
  pageSize: number;
  sort: "recent" | "favorite";
  keyword?: string;
}) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  //insensitive는 영어 검색시 대소문자 구분 X
  const where = keyword
    ? { name: { contains: keyword, mode: "insensitive" as const } }
    : {};
  const orderBy =
    sort === "favorite"
      ? { likeCount: "desc" as const }
      : { createdAt: "desc" as const };

  const [list, totalProducts] = await Promise.all([
    productRepository.findMany({ where, orderBy, skip, take }),
    productRepository.count(where),
  ]);

  return { list, totalProducts };
};

const getProduct = async ({
  productId,
  authorId,
}: {
  productId: number;
  authorId?: number;
}) => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new CustomError("존재하지 않는 상품입니다.", 404);
  }

  let isLiked = false;
  if (authorId) {
    isLiked = !!(await productRepository.findLike(authorId, productId));
  }

  return { ...product, isLiked };
};

const likeProduct = async ({
  productId,
  authorId,
}: {
  productId: number;
  authorId: number;
}) => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new CustomError("존재하지 않는 상품입니다.", 404);
  }

  const [updatedProduct] = await productRepository.likeTransaction(
    authorId,
    productId,
  );
  return { ...updatedProduct, isLiked: true };
};

const unlikeProduct = async ({
  productId,
  authorId,
}: {
  productId: number;
  authorId: number;
}) => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new CustomError("존재하지 않는 상품입니다.", 404);
  }

  const [updatedProduct] = await productRepository.unlikeTransaction(
    authorId,
    productId,
  );
  return { ...updatedProduct, isLiked: false };
};

export default {
  createProduct,
  deleteProduct,
  updateProduct,
  getProductList,
  getProduct,
  likeProduct,
  unlikeProduct,
};
