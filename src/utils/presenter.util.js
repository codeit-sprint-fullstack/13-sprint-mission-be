function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function likedByViewer(likes = [], viewerId) {
  return Boolean(viewerId && likes.some((like) => like.userId === viewerId));
}

function productResponse(product, viewerId) {
  return {
    ...product,
    images: product.imageUrls || [],
    favoriteCount: product.likes?.length || 0,
    isFavorite: likedByViewer(product.likes, viewerId),
    isLiked: likedByViewer(product.likes, viewerId),
    writer: publicUser(product.owner),
    ownerNickname: product.owner?.nickname,
    likes: undefined,
    owner: undefined,
  };
}

function articleResponse(article, viewerId) {
  return {
    ...article,
    images: article.imageUrls || [],
    favoriteCount: article.likes?.length || 0,
    isFavorite: likedByViewer(article.likes, viewerId),
    isLiked: likedByViewer(article.likes, viewerId),
    writer: publicUser(article.owner),
    ownerNickname: article.owner?.nickname,
    likes: undefined,
    owner: undefined,
  };
}

function commentResponse(comment) {
  return {
    ...comment,
    writer: publicUser(comment.owner),
    ownerNickname: comment.owner?.nickname,
    owner: undefined,
  };
}

export { articleResponse, commentResponse, productResponse, publicUser };
