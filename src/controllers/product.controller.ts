import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth.js";
import * as productService from "../services/product.service.js";
import { BadRequestError } from "../middlewares/errorHandler.js";
import { CreateProductInput, UpdateProductInput } from "../schemas/product.schema.js";

// productId가 숫자가 아니면(예: 잘못된 값, 리졸브 안 된 변수 등) Prisma가 500을 던지기 전에
// 여기서 먼저 400으로 걸러줌
function parseProductId(productId: string) {
  const parsedId = parseInt(productId);
  if (isNaN(parsedId)) {
    throw new BadRequestError("productId는 숫자여야 합니다.");
  }
  return parsedId;
}

// [ ]  상품 상세 조회 API를 만들어 주세요.
// 요구사항(상품 상세): "해당 상품에 대한 댓글 리스트, 사용자가 '좋아요'를 눌렀는지
// 여부를 확인할 수 있도록 응답 객체에 포함시켜 반환해 주세요."
export const getProduct = async (req: Request, res: Response) => {
  const { productId } = req.params as { productId: string };
  const product = await productService.getProduct(parseProductId(productId), req.auth?.userId);
  res.json({ success: true, data: product });
};

// [ ]  상품 등록 API를 만들어 주세요.
// 요구사항(상품 기능 인가): "로그인한 사용자만 상품을 등록할 수 있습니다."
export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  const input = req.body as CreateProductInput;
  const product = await productService.createProduct(input, req.auth.userId);
  res.status(201).json({ success: true, data: product });
};

// [ ]  상품 수정 API를 만들어 주세요. (PATCH)
// 요구사항(상품 기능 인가): "상품을 등록한 사용자만 해당 상품의 정보를 수정할 수 있습니다."
export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params as { productId: string };
  const data = req.body as UpdateProductInput;
  const product = await productService.updateProduct(
    parseProductId(productId),
    req.auth.userId,
    data,
  );
  res.json({ success: true, data: product });
};

// [ ]  상품 삭제 API를 만들어 주세요.
// 요구사항(상품 기능 인가): "상품을 등록한 사용자만 해당 상품을 삭제를 할 수 있습니다."
export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params as { productId: string };
  await productService.deleteProduct(parseProductId(productId), req.auth.userId);
  res.status(204).send();
};

// [ ]  상품 목록 조회 API를 만들어 주세요.
// [ ]  offset 방식의 페이지네이션 기능을 포함해 주세요.
// [ ]  name, description에 포함된 단어로 검색할 수 있습니다.
export const getProducts = async (req: Request, res: Response) => {
  const {
    search,
    page = "1",
    limit = "10",
    orderBy,
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const take = Math.max(1, parseInt(limit) || 10);

  const { products, total } = await productService.getProducts({
    search,
    page: pageNum,
    limit: take,
    orderBy,
  });

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
export const likeProduct = async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params as { productId: string };
  const product = await productService.likeProduct(req.auth.userId, parseProductId(productId));
  res.status(201).json({ success: true, data: product });
};

// 요구사항(좋아요 기능): "사용자는 상품에 '좋아요'를 취소할 수 있습니다."
export const unlikeProduct = async (req: AuthenticatedRequest, res: Response) => {
  const { productId } = req.params as { productId: string };
  const product = await productService.unlikeProduct(req.auth.userId, parseProductId(productId));
  res.json({ success: true, data: product });
};
