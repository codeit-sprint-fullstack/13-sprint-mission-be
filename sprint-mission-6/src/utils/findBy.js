// utils/findBy.js
// feedback: 수정 ㄱㄱㄱㄱㄱ 재사용할수있도록

export const keywordFilter = (keyword, prices, tag) => {
  const filtered = {};
  if (keyword) {
    filtered.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }
  return filtered;
};

export const productSort = (sort) => {
  return sort === "recent" ? { createdAt: -1 } : { createdAt: 1 };
};

export const getPagination = (offset, limit) => {
  const offsetNum = Math.max(0, parseInt(offset) || 0);
  const limitNum = Math.max(1, parseInt(limit) || 10);
  return { offsetNum, limitNum };
};
