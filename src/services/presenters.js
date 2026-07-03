function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    image: user.image || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function productResponse(product, viewerId) {
  const likes = product.likes || [];
  const writer = publicUser(product.owner);
  return {
    ...product,
    images: product.imageUrls || [],
    favoriteCount: likes.length,
    isFavorite: viewerId
      ? likes.some((like) => like.userId === viewerId)
      : false,
    isLiked: viewerId ? likes.some((like) => like.userId === viewerId) : false,
    ownerNickname: writer?.nickname || "",
    writer,
    likes: undefined,
    owner: undefined,
  };
}

function articleResponse(article, viewerId) {
  const likes = article.likes || [];
  return {
    ...article,
    images: article.imageUrls || [],
    favoriteCount: likes.length,
    isFavorite: viewerId
      ? likes.some((like) => like.userId === viewerId)
      : false,
    isLiked: viewerId ? likes.some((like) => like.userId === viewerId) : false,
    writer: publicUser(article.owner),
    likes: undefined,
    owner: undefined,
  };
}

function commentResponse(comment) {
  return {
    ...comment,
    writer: publicUser(comment.owner),
    owner: undefined,
  };
}

module.exports = {
  articleResponse,
  commentResponse,
  productResponse,
  publicUser,
};
