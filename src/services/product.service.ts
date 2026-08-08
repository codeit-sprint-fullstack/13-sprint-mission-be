import { HttpError } from "../middlewares/error";
import * as productsRepository from "../repositories/product.repository";
import * as commentsRepository from "../repositories/comment.repository";
import { createId, prisma } from "../repositories/prisma.repository";
import { commentResponse, productResponse } from "../utils/presenter.util";
import { paginate } from "../utils/list.util";
import type {
  AuthUser,
  ListQuery,
  ProductBody,
  ViewerId,
} from "../types/domain";

function normalizeImages(
  body: Pick<ProductBody, "imageUrls" | "images">,
): string[] {
  if (Array.isArray(body.imageUrls)) return body.imageUrls.slice(0, 3);
  if (Array.isArray(body.images)) return body.images.slice(0, 3);
  return [];
}

async function list(query: ListQuery, viewerId?: ViewerId) {
  const keyword = String(query.keyword || "").trim();
  const products = await productsRepository.findAll({
    keyword,
    orderBy: query.orderBy,
  });
  return paginate(
    products.map((product) => productResponse(product, viewerId)),
    query,
  );
}

async function best(query: ListQuery, viewerId?: ViewerId) {
  const limit = Number(query.limit || 4);
  const products = await productsRepository.findAll({ orderBy: "favorite" });
  return {
    list: products
      .slice(0, limit)
      .map((product) => productResponse(product, viewerId)),
  };
}

async function detail(productId: string, viewerId?: ViewerId) {
  const product = await productsRepository.findById(productId);
  if (!product) throw new HttpError(404, "상품을 찾을 수 없습니다.");
  const comments = await commentsRepository.findByTarget("product", product.id);
  return {
    ...productResponse(product, viewerId),
    comments: comments.map(commentResponse),
  };
}

async function create(body: ProductBody, user: AuthUser) {
  const product = await productsRepository.create({
    id: createId("product"),
    name: body.name,
    description: body.description,
    price: body.price,
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    imageUrls: normalizeImages(body),
    ownerId: user.id,
  });
  return productResponse(product, user.id);
}

async function update(productId: string, body: ProductBody, user: AuthUser) {
  const product = await productsRepository.findById(productId);
  if (!product) throw new HttpError(404, "상품을 찾을 수 없습니다.");
  if (product.ownreId !== user.id)
    throw new HttpError(403, "상품 작성자만 수정할 수 있습니다.");
  const updated = await productsRepository.update(productId, {
    name: body.name,
    description: body.description,
    price: body.price,
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    imageUrls: normalizeImages(body),
  });
  return productResponse(updated, user.id);
}

async function remove(productId: string, user: AuthUser) {
  const product = await productsRepository.findById(productId);
  if (!product) throw new HttpError(404, "상품을 찾을 수 없습니다.");
  if (product.ownerId !== user.id)
    throw new HttpError(403, "상품 작성자만 삭제할 수 있습니다.");
  await productsRepository.remove(product.id);
  return { ok: true };
}

async function favorite(productId: string, user: AuthUser) {
  const product = await productsRepository.findById(productId);
  if (!product) throw new HttpError(404, "상품을 찾을 수 없습니다.");
  await prisma.$transaction(async (tx) => {
    await tx.productLike.upsert({
      where: { productId_userId: { productId, userId: user.id } },
      update: {},
      create: { id: createId("product_like"), productId, userId: user.id },
    });
  });
  const updated = await productsRepository.findById(productId);
  if (!updated) throw new HttpError(404, "상품을 찾을 수 없습니다.");
  return productResponse(updated, user.id);
}

async function unfavorite(productId: string, user: AuthUser) {
  const product = await productsRepository.findById(productId);
  if (!product) throw new HttpError(404, "상품을 찾을 수 없습니다.");
  await prisma.$transaction(async (tx) => {
    await tx.productLike.deleteMany({ where: { productId, userId: user.id } });
  });
  const updated = await productsRepository.findById(productId);
  if (!updated) throw new HttpError(404, "상품을 찾을 수 없습니다.");
  return productResponse(updated, user.id);
}

export { best, create, detail, favorite, list, remove, unfavorite, update };
