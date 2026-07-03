function paginate(items, query) {
  const page = Math.max(Number(query.page || 1), 1);
  const pageSize = Math.max(Number(query.pageSize || query.limit || 10), 1);
  const start = (page - 1) * pageSize;
  return {
    list: items.slice(start, start + pageSize),
    totalCount: items.length,
    nextCursor: start + pageSize < items.length ? String(page + 1) : null,
  };
}

function sortByRecentOrFavorite(items, orderBy) {
  const list = [...items];
  if (orderBy === "favorite") {
    return list.sort(
      (a, b) => b.favoriteUserIds.length - a.favoriteUserIds.length,
    );
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = { paginate, sortByRecentOrFavorite };
