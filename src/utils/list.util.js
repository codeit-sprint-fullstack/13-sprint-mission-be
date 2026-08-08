function paginate(items, query = {}) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.max(Number(query.limit || 10), 1);
  const start = (page - 1) * limit;
  const list = items.slice(start, start + limit);
  const totalCount = items.length;
  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);
  return { list, page, limit, totalCount, totalPages };
}

function sortByRecentOrFavorite(items, orderBy) {
  const copied = [...items];
  if (orderBy === "favorite") {
    return copied.sort(
      (a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0),
    );
  }
  return copied.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export { paginate, sortByRecentOrFavorite };
