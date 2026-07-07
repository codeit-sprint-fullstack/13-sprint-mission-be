// product.controller.js
import * as productRepository from "../repositories/product.repository.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../middlewares/errorHandler.js";

// productId가 숫자가 아니면(예: 잘못된 값, 리졸브 안 된 변수 등) Prisma가 500을 던지기 전에
// 여기서 먼저 400으로 걸러줌
function parseProductId(productId) {
  const parsedId = parseInt(productId);
  if (isNaN(parsedId)) {
    throw new BadRequestError("productId는 숫자여야 합니다.");
  }
  return parsedId;
}

// [ ]  상품 상세 조회 API를 만들어 주세요.
// 요구사항(상품 상세): "해당 상품에 대한 댓글 리스트, 사용자가 '좋아요'를 눌렀는지
// 여부를 확인할 수 있도록 응답 객체에 포함시켜 반환해 주세요."
export const getProduct = async (req, res) => {
  const { productId } = req.params;
  const parsedId = parseProductId(productId);
  const product = await productRepository.findById(parsedId);
  if (!product) throw new NotFoundError("Product을 찾을 수 없습니다");

  const isLiked = req.auth?.userId
    ? await productRepository.isLikedByUser(req.auth.userId, parsedId)
    : false;

  res.json({ success: true, data: { ...product, isLiked } });
};

// [ ]  상품 등록 API를 만들어 주세요.
// 요구사항(상품 기능 인가): "로그인한 사용자만 상품을 등록할 수 있습니다."
export const createProduct = async (req, res) => {
  const { name, description, price, tags, images } = req.body;
  const product = await productRepository.create({
    name,
    description,
    price,
    tags,
    images,
    userId: req.auth.userId,
  });
  res.status(201).json({ success: true, data: product });
};

// [ ]  상품 수정 API를 만들어 주세요. (PATCH)
// 요구사항(상품 기능 인가): "상품을 등록한 사용자만 해당 상품의 정보를 수정할 수 있습니다."
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const parsedId = parseProductId(productId);

  const existing = await productRepository.findByIdSimple(parsedId);
  if (!existing) throw new NotFoundError("Product을 찾을 수 없습니다");
  if (existing.userId !== req.auth.userId) {
    throw new ForbiddenError("본인이 등록한 상품만 수정할 수 있습니다.");
  }

  const product = await productRepository.update(parsedId, req.body);
  res.json({ success: true, data: product });
};

// [ ]  상품 삭제 API를 만들어 주세요.
// 요구사항(상품 기능 인가): "상품을 등록한 사용자만 해당 상품을 삭제를 할 수 있습니다."
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const parsedId = parseProductId(productId);

  const existing = await productRepository.findByIdSimple(parsedId);
  if (!existing) throw new NotFoundError("Product을 찾을 수 없습니다");
  if (existing.userId !== req.auth.userId) {
    throw new ForbiddenError("본인이 등록한 상품만 삭제할 수 있습니다.");
  }

  await productRepository.remove(parsedId);
  res.status(204).send();
};

// [ ]  상품 목록 조회 API를 만들어 주세요.
// [ ]  offset 방식의 페이지네이션 기능을 포함해 주세요.
// [ ]  name, description에 포함된 단어로 검색할 수 있습니다.
export const getProducts = async (req, res) => {
  const { search, page = "1", limit = "10" } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const take = Math.max(1, parseInt(limit) || 10);
  const skip = (pageNum - 1) * take;

  const [products, total] = await Promise.all([
    productRepository.findMany({ skip, take, keyword: search }),
    productRepository.count({ keyword: search }),
  ]);

  res.json({
    success: true,
    page: pageNum,
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
    data: products,
  });
};

// 요구사항(좋아요 기능): "사용자는 상품에 '좋아요'를 할 수 있습니다."
export const likeProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await productRepository.likeProduct(
    req.auth.userId,
    parseProductId(productId),
  );
  res.status(201).json({ success: true, data: { ...product, isLiked: true } });
};

// 요구사항(좋아요 기능): "사용자는 상품에 '좋아요'를 취소할 수 있습니다."
export const unlikeProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await productRepository.unlikeProduct(
    req.auth.userId,
    parseProductId(productId),
  );
  res.json({ success: true, data: { ...product, isLiked: false } });
};
