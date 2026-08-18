import {
  Article,
  ArticleComment,
  Product,
  ProductComment,
} from "@prisma/client";

export type ProductCommentInput = Pick<ProductComment, "content">;
export type ArticleCommentInput = Pick<ArticleComment, "content">;

export type CommentTarget =
  | { type: "product"; id: Product["id"]; data: ProductCommentInput }
  | { type: "article"; id: Article["id"]; data: ArticleCommentInput };
