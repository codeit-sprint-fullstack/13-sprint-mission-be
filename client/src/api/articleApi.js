import { request } from "./request";

export function getArticles({ offset = 0, limit = 10, keyword = "" } = {}) {
  const params = new URLSearchParams({
    offset,
    limit,
    orderBy: "recent",
  });

  if (keyword) params.append("keyword", keyword);

  return request(`/articles?${params.toString()}`);
}

export function getArticle(id) {
  return request(`/articles/${id}`);
}

export function createArticle(article) {
  return request("/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article),
  });
}

export function getArticleComments(articleId, { limit = 5 } = {}) {
  // 변경: cursor 기능은 아직 빼고 limit만 사용합니다.
  const params = new URLSearchParams({ limit });

  return request(`/articles/${articleId}/comments?${params.toString()}`);
}

export function createArticleComment(articleId, content) {
  return request(`/articles/${articleId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}
