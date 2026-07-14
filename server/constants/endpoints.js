const ENDPOINTS = {
  ITEMS: "/items",
  ITEM_BY_ID: "/items/:id",
  ITEM_COMMENTS: "/items/:id/comments",
  ITEM_FAVORITE: "/items/:id/favorite",
  PRODUCTS: "/products",
  PRODUCT_BY_ID: "/products/:id",
  PRODUCT_COMMENTS: "/products/:id/comments",
  PRODUCT_FAVORITE: "/products/:id/favorite",
  ARTICLES: "/articles",
  ARTICLE_BY_ID: "/articles/:id",
  ARTICLE_COMMENTS: "/articles/:id/comments",
  ARTICLE_COMMENT_BY_ID: "/articles/:id/comments/:commentId",
  ARTICLE_FAVORITE: "/articles/:id/favorite",
  COMMENT_BY_ID: "/comments/:commentId",
  AUTH_SIGN_UP: "/auth/signUp",
  AUTH_SIGN_IN: "/auth/signIn",
  AUTH_ME: "/auth/me",
};

module.exports = ENDPOINTS;
