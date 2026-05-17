const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function request(url, options) {
  const res = await fetch(`${API_BASE_URL}${url}`, options);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "요청에 실패했습니다.");
  }

  return data;
}
