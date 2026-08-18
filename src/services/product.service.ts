import * as productRepository from "../repositories/product.repository.js";
import { NotFoundError, ForbiddenError } from "../middlewares/errorHandler.js";
import { CreateProductInput, UpdateProductInput } from "../schemas/product.schema.js";

// [ ]  상품 상세 조회 API를 만들어 주세요.
// 요구사항(상품 상세): "해당 상품에 대한 댓글 리스트, 사용자가 '좋아요'를 눌렀는지
// 여부를 확인할 수 있도록 응답 객체에 포함시켜 반환해 주세요."
export async function getProduct(id: number, userId?: number) {
  const product = await productRepository.findById(id);
  if (!product) throw new NotFoundError("Product을 찾을 수 없습니다");

  const isLiked = userId ? await productRepository.isLikedByUser(userId, id) : false;
  return { ...product, isLiked };
}

// [ ]  상품 등록 API를 만들어 주세요.
// 요구사항(상품 기능 인가): "로그인한 사용자만 상품을 등록할 수 있습니다."
export async function createProduct(input: CreateProductInput, userId: number) {
  return productRepository.create({ ...input, userId });
}

async function assertProductOwner(id: number, userId: number) {
  const existing = await productRepository.findByIdSimple(id);
  if (!existing) throw new NotFoundError("Product을 찾을 수 없습니다");
  if (existing.userId !== userId) {
    throw new ForbiddenError("본인이 등록한 상품만 수정할 수 있습니다.");
  }
}

// [ ]  상품 수정 API를 만들어 주세요. (PATCH)
// 요구사항(상품 기능 인가): "상품을 등록한 사용자만 해당 상품의 정보를 수정할 수 있습니다."
export async function updateProduct(id: number, userId: number, data: UpdateProductInput) {
  await assertProductOwner(id, userId);

  // tags는 Tag 릴레이션이라 평범한 문자열 배열로는 update에 바로 넣을 수 없어서 제외
  // (릴레이션 갱신은 아직 지원하지 않음 - 이전에도 동작하지 않던 부분)
  const { name, description, price, images } = data;
  return productRepository.update(id, { name, description, price, images });
}

// [ ]  상품 삭제 API를 만들어 주세요.
// 요구사항(상품 기능 인가): "상품을 등록한 사용자만 해당 상품을 삭제를 할 수 있습니다."
export async function deleteProduct(id: number, userId: number) {
  await assertProductOwner(id, userId);
  await productRepository.remove(id);
}

interface GetProductsParams {
  search?: string;
  page: number;
  limit: number;
  orderBy?: string;
}

// [ ]  상품 목록 조회 API를 만들어 주세요.
// [ ]  offset 방식의 페이지네이션 기능을 포함해 주세요.
// [ ]  name, description에 포함된 단어로 검색할 수 있습니다.
export async function getProducts({ search, page, limit, orderBy }: GetProductsParams) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    productRepository.findMany({ skip, take: limit, keyword: search, orderBy }),
    productRepository.count({ keyword: search }),
  ]);

  return { products, total };
}

// 요구사항(좋아요 기능): "사용자는 상품에 '좋아요'를 할 수 있습니다."
export async function likeProduct(userId: number, id: number) {
  const product = await productRepository.likeProduct(userId, id);
  return { ...product, isLiked: true };
}

// 요구사항(좋아요 기능): "사용자는 상품에 '좋아요'를 취소할 수 있습니다."
export async function unlikeProduct(userId: number, id: number) {
  const product = await productRepository.unlikeProduct(userId, id);
  return { ...product, isLiked: false };
}
