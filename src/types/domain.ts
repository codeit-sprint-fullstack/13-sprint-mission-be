import type { Article, Comment, Prisma, Product, User } from "@prisma/client";

export type SortOrder = "recent" | "favorite";
export type TargetType = "product" | "article";

export type TargetRef =
  | { targetType: "product"; targetId: string }
  | { targetType: "article"; targetId: string };

export interface ListQuery {
  page?: string | number;
  limit?: string | number;
  keyword?: string;
  orderBy?: SortOrder | string;
}

export interface ProductBody {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  imageUrls?: string[];
  images?: string[];
}

export interface ArticleBody {
  title: string;
  content: string;
  imageUrls?: string[];
  images?: string[];
}

export interface AuthBody {
  email: string;
  nickname?: string;
  password: string;
}

export interface PublicUser {
  id: string;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Paginated<TItem> {
  list: TItem[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export type EntityBodyMap = {
  product: ProductBody;
  article: ArticleBody;
  comment: Pick<Comment, "content">;
};

export type EntityBody<TEntity extends keyof EntityBodyMap> =
  EntityBodyMap[TEntity];

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { owner: true; likes: true };
}>;

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: { owner: true; likes: true };
}>;

export type CommentWithOwner = Prisma.CommentGetPayload<{
  include: { owner: true };
}>;

export type ViewerId = string | undefined;

export type AuthUser = User;
export type ProductCreateData = Prisma.ProductUncheckedCreateInput;
export type ProductUpdateData = Prisma.ProductUncheckedUpdateInput;
export type ArticleCreateData = Prisma.ArticleUncheckedCreateInput;
export type ArticleUpdateData = Prisma.ArticleUncheckedUpdateInput;
export type CommentCreateData = Prisma.CommentUncheckedCreateInput;
export type CommentUpdateData = Prisma.CommentUncheckedUpdateInput;

export type FeedItem = (Product | Article) & { favoriteCount?: number };
