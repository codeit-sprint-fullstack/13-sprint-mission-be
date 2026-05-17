import { request } from "./request";

export function getProducts({ offset = 0, limit = 10, keyword = "" } = {}) {
  const params = new URLSearchParams({
    offset,
    limit,
    orderBy: "recent",
  });

  if (keyword) params.append("keyword", keyword);

  return request(`/products?${params.toString()}`);
}

export function getProduct(id) {
  return request(`/products/${id}`);
}

export function createProduct(product) {
  return request("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
}

export function getProductComments(productId, { limit = 5 } = {}) {
  // 변경: cursor 기능은 아직 빼고 limit만 사용합니다.
  const params = new URLSearchParams({ limit });

  return request(`/products/${productId}/comments?${params.toString()}`);
}

export function createProductComment(productId, content) {
  return request(`/products/${productId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}
