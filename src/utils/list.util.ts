import type {
  FeedItem,
  ListQuery,
  Paginated,
  SortOrder,
} from "../types/domain";

function paginate<T>(items: T[], query: ListQuery = {}): Paginated<T> {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.max(Number(query.limit || 10), 1);
  const start = (page - 1) * limit;
  const list = items.slice(start, start + limit);
  const totalCount = items.length;
  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);
  return { list, page, limit, totalCount, totalPages };
}

function sortByRecentOrFavorite<T extends FeedItem>(
  items: T[],
  orderBy?: SortOrder | string,
): T[] {
  const copied = [...items];
  if (orderBy === "favorite") {
    return copied.sort(
      (a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0),
    );
  }
  return copied.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export { paginate, sortByRecentOrFavorite };
